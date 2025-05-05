FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/nginx.conf.template

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# "This container will listen for network connections on port 3000."
# It’s a hint to the person or system running the container.
# However, the port is not opened!
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
