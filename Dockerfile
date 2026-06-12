FROM php:8.2-apache

# Install required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy custom PHP config for Docker environment
COPY docker-config.php /var/www/html/api/config.php

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html
