# Generated by Django 5.1.4 on 2024-12-11 12:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core_app', '0010_databasetable'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='databasetable',
            options={'managed': False, 'verbose_name': 'Tabela bazy danych', 'verbose_name_plural': 'Tabele bazy danych'},
        ),
    ]