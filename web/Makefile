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


API_HOST := $(shell echo "$(API_URL)" | sed 's|https\?://||g' | sed 's|:[0-9]*||g')
configure-nginx:
	@echo "$(API_URL)" >> /etc/nginx/conf.d/api.url
	@echo "$(API_HOST)" >> /etc/nginx/conf.d/api.host

	@sed -i "s|%%API_URL%%|$(API_URL)|g" /etc/nginx/conf.d/default.conf
	@sed -i "s|%%API_HOST%%|$(API_HOST)|g" /etc/nginx/conf.d/default.conf