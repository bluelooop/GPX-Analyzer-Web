# create-env-file:
# Creates or overwrites the .env file for the environment.
#
# Note:
#   Ensure the following environment variables are set:
#   - ENV_FILE
#   - API_URL
#
# Usage:
#   make create-env-file
create-env-file:
	@rm -f $(ENV_FILE)
	@touch $(ENV_FILE)

	@echo "VITE_API_URL=$(API_URL)" >> $(ENV_FILE)
	@echo "ENV file created"

configure-nginx: API_SERVER_NAME := $(shell echo "$(API_URL)" | sed 's|https\?://||g' | sed 's|:[0-9]*||g')
configure-nginx:
	@sed -i "s|%%API_SERVER_NAME%%|$(API_SERVER_NAME)|g" nginx/$(NGINX_CONF)
	@sed -i "s|%%API_URL%%|$(API_URL)|g" nginx/$(NGINX_CONF)