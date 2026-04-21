FROM php:8.3-apache

# Install dependencies and extensions
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    && docker-php-ext-install curl

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configure Apache DocumentRoot to /var/www/html/public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Copy project files
COPY public/ /var/www/html/public/
COPY src/ /var/www/html/src/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Default Environment Variables
ENV BITCOIN_RPC_URL=http://host.docker.internal:18443
ENV BITCOIN_RPC_USER=local_rpc
ENV BITCOIN_RPC_PASSWORD=local_rpc_password

EXPOSE 80

# The base image already has an ENTRYPOINT that starts Apache
