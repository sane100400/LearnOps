FROM php:8.1-apache

# Install mysqli extension
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copy Apache config
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Copy PHP source
COPY src/ /var/www/html/

# Copy SQL setup for DB initialization
COPY src/setup.sql /docker-entrypoint-initdb.d/

RUN chown -R www-data:www-data /var/www/html \
    && a2enmod rewrite

EXPOSE 80
