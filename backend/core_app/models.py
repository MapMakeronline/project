import csv
import logging
import re

from django.db import models, transaction, connection
from django.db.models import QuerySet

logger = logging.getLogger(__name__)


class DatabaseTableManager(models.Manager):
    def get_queryset(self):
        return DatabaseTableQuerySet(self.model, using=self._db)


class DatabaseTableQuerySet(models.QuerySet):
    def count(self):
        # Переопределяем метод count, чтобы избежать запроса к несуществующей таблице
        return len(self._fetch_all())

    def _fetch_all(self):
        if self._result_cache is None:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    AND table_type = 'BASE TABLE'
                    AND table_name NOT LIKE 'django_%'
                    AND table_name NOT LIKE 'auth_%'
                """)
                tables = cursor.fetchall()

                self._result_cache = []
                for (table_name,) in tables:
                    try:
                        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
                        count = cursor.fetchone()[0]
                        self._result_cache.append(
                            DatabaseTable(
                                table_name=table_name,
                                row_count=count
                            )
                        )
                    except Exception as e:
                        logger.error(f"Error processing table {table_name}: {str(e)}")
        return self._result_cache


class DatabaseTable(models.Model):
    table_name = models.CharField("Nazwa tabeli", max_length=100, primary_key=True)
    row_count = models.IntegerField("Liczba wierszy")

    objects = DatabaseTableManager()

    class Meta:
        managed = False
        verbose_name = 'Tabela bazy danych'
        verbose_name_plural = 'Tabele bazy danych'
        ordering = ['table_name']

    def __str__(self):
        return f"{self.table_name} ({self.row_count} wierszy)"
    def __str__(self):
        return f"{self.table_name} ({self.row_count} wierszy)"

    @classmethod
    def get_all_tables(cls) -> QuerySet:
        try:
            # Создаем пустой QuerySet
            qs = cls.objects.none()
            table_objects = []

            with connection.cursor() as cursor:
                # Получаем список всех таблиц
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    AND table_type = 'BASE TABLE'
                    AND table_name NOT LIKE 'django_%'
                    AND table_name NOT LIKE 'auth_%'
                """)
                tables = cursor.fetchall()

                logger.info(f"Found {len(tables)} tables in database")

                # Получаем количество строк для каждой таблицы
                for (table_name,) in tables:
                    try:
                        cursor.execute(f"SELECT COUNT(*) FROM \"{table_name}\"")
                        count = cursor.fetchone()[0]
                        table_objects.append(
                            cls(
                                table_name=table_name,
                                row_count=count
                            )
                        )
                        logger.info(f"Added table {table_name} with {count} rows")
                    except Exception as e:
                        logger.error(f"Error processing table {table_name}: {str(e)}")

            # Если есть объекты, создаем новый QuerySet с ними
            if table_objects:
                qs = cls.objects.all()
                qs._result_cache = table_objects
                logger.info(f"Returning QuerySet with {len(table_objects)} tables")
            else:
                logger.warning("No tables found in database")

            return qs
        except Exception as e:
            logger.error(f"Error in get_all_tables: {str(e)}")
            return cls.objects.none()


class CSVFile(models.Model):
    title = models.CharField(max_length=100, verbose_name='nazwa tublica')
    file = models.FileField(upload_to='csv_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Plik CSV'
        verbose_name_plural = 'Pliki CSV'

    def __str__(self):
        return self.title

    def clean_column_name(self, name, existing_names):
        if not name:
            name = 'column'
        clean_name = ''.join(e.lower() if e.isalnum() else '_' for e in name)
        clean_name = clean_name.strip('_')

        base_name = clean_name
        counter = 1
        while clean_name in existing_names:
            clean_name = f"{base_name}_{counter}"
            counter += 1

        return clean_name

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:  # Только для новых файлов
            try:
                with transaction.atomic():
                    table_name = self.title.lower()
                    table_name = ''.join(e if e.isalnum() else '_' for e in table_name)

                    with connection.cursor() as cursor:
                        cursor.execute(f'DROP TABLE IF EXISTS {table_name}')

                        with self.file.open(mode='r') as file:
                            csv_reader = csv.DictReader(file)
                            original_headers = csv_reader.fieldnames

                            existing_names = set()
                            clean_headers = []
                            header_mapping = {}

                            for header in original_headers:
                                if header:
                                    clean_header = self.clean_column_name(header, existing_names)
                                    clean_headers.append(clean_header)
                                    existing_names.add(clean_header)
                                    header_mapping[header] = clean_header

                            columns = [f"{header} TEXT" for header in clean_headers]

                            create_table_sql = f"""
                            CREATE TABLE {table_name} (
                                id SERIAL PRIMARY KEY,
                                {', '.join(columns)}
                            )
                            """
                            cursor.execute(create_table_sql)

                            insert_sql = f"""
                            INSERT INTO {table_name} (
                                {', '.join(clean_headers)}
                            )
                            VALUES ({', '.join(['%s' for _ in clean_headers])})
                            """

                            # Читаем все строки разом
                            file.seek(0)
                            next(csv_reader)  # Пропускаем заголовки
                            batch = [
                                [row[header] for header in original_headers if header and header in header_mapping]
                                for row in csv_reader
                            ]

                            # Вставляем все данные одним запросом
                            if batch:
                                cursor.executemany(insert_sql, batch)

            except Exception as e:
                raise Exception(f'Błąd podczas przetwarzania pliku CSV: {str(e)}')


class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    title = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=10)
    table_name = models.CharField(max_length=63, blank=True)

    def __str__(self):
        return f"{self.title} ({self.uploaded_at})"

    def clean_column_name(self, name):
        """Czyszczenie nazwy kolumny do użycia w PostgreSQL"""
        # Zamień wszystkie znaki niealfanumeryczne na podkreślenie
        clean_name = re.sub(r'[^\w]', '_', name.lower())
        # Usuń wielokrotne podkreślenia
        clean_name = re.sub(r'_+', '_', clean_name)
        # Usuń podkreślenia na początku i końcu
        clean_name = clean_name.strip('_')

        # Upewnij się, że nazwa nie zaczyna się od cyfry
        if clean_name[0].isdigit():
            clean_name = 'col_' + clean_name

        return clean_name

    def generate_unique_table_name(self, base_name):
        """Generowanie unikalnej nazwy tabeli"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            existing_tables = [row[0] for row in cursor.fetchall()]

        table_name = base_name
        counter = 1
        while table_name in existing_tables:
            table_name = f"{base_name}_{counter}"
            counter += 1

        return table_name

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:
            try:
                with transaction.atomic():
                    base_table_name = self.title.lower()
                    base_table_name = ''.join(e if e.isalnum() else '_' for e in base_table_name)
                    table_name = self.generate_unique_table_name(base_table_name)
                    self.table_name = table_name

                    with connection.cursor() as cursor:
                        # Читаем файл как текст для подсчета строк
                        with self.file.open(mode='r') as file:
                            # Используем csv.reader вместо DictReader для точного подсчета
                            csv_reader = csv.reader(file)
                            headers = next(csv_reader)

                            # Очищаем имена столбцов
                            clean_headers = [self.clean_column_name(header) for header in headers if header]

                            # Создаем таблицу
                            create_table_sql = f"""
                            CREATE TABLE {table_name} (
                                id SERIAL PRIMARY KEY,
                                {', '.join(f"{header} TEXT" for header in clean_headers)}
                            )
                            """
                            cursor.execute(create_table_sql)

                            # SQL для вставки данных
                            insert_sql = f"""
                            INSERT INTO {table_name} (
                                {', '.join(clean_headers)}
                            )
                            VALUES ({', '.join(['%s' for _ in clean_headers])})
                            """

                            # Собираем все строки данных
                            batch = []
                            for row in csv_reader:
                                # Берем только значения для непустых столбцов
                                values = []
                                col_idx = 0
                                for cell in row:
                                    if headers[col_idx]:
                                        values.append(cell)
                                    col_idx += 1
                                batch.append(values)

                            # Вставляем данные
                            if batch:
                                cursor.executemany(insert_sql, batch)

                    super().save(update_fields=['table_name'])

            except Exception as e:
                raise Exception(f'Błąd podczas przetwarzania pliku: {str(e)}')

    def delete(self, *args, **kwargs):
        if self.table_name:
            with connection.cursor() as cursor:
                cursor.execute(f"DROP TABLE IF EXISTS {self.table_name}")
        super().delete(*args, **kwargs)
