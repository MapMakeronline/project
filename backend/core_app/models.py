import csv
import os

from django.db import models, transaction, connection


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
