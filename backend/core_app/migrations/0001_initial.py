# Generated by Django 5.1.4 on 2024-12-10 14:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CSVFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('file', models.FileField(upload_to='csv_files/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='CSVData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('row_data', models.JSONField()),
                ('csv_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data', to='core_app.csvfile')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]