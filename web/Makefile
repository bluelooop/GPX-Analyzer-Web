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
	@sed -i "s|%%API_URL%%|$(API_URL)|g" nginx/web.conf
	@sed -i "s|%%API_HOST%%|$(API_HOST)|g" nginx/web.conf
	@echo "Nginx configuration changed:"
	@echo "API_URL: $(API_URL)"
	@echo "API_HOST: $(API_HOST)"