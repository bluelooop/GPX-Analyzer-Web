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