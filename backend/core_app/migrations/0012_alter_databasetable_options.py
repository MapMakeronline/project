# Generated by Django 5.1.4 on 2024-12-13 08:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core_app', '0011_alter_databasetable_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='databasetable',
            options={'managed': False, 'ordering': ['table_name'], 'verbose_name': 'Tabela bazy danych', 'verbose_name_plural': 'Tabele bazy danych'},
        ),
    ]
