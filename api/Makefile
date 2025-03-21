GPX_ANALYZER_LIB_PYTHON_VERSION := $(shell cat $(GPX_ANALYZER_LIB_PATH)/PYTHON_VERSION)
PYENV := ~/.pyenv/versions/$(GPX_ANALYZER_LIB_PYTHON_VERSION)
PYTHON_HOST := $(PYENV)/bin/python

# Documentation for Makefile Commands

# clone-gpx-analyzer:
# Clones the GPX Analyzer repository from the specified GitHub URL into the 
# directory defined by the `GPX_ANALYZER_LIB_PATH` environment variable.
# It removes any existing content in the target directory before cloning.
#
# Usage:
#   make clone-gpx-analyzer
clone-gpx-analyzer:
	@rm rf $(GPX_ANALYZER_LIB_PATH) 2> /dev/null || true
	@git clone https://github.com/bluelooop/GPX-Analyzer.git $(GPX_ANALYZER_LIB_PATH)
	@echo "GPX Analyzer library cloned"

# create-gpx-analyzer-python-venv:
# Creates a Python virtual environment
#
# Usage:
#   make create-gpx-analyzer-python-venv
create-gpx-analyzer-python-venv:
	# Read the GPX Analyzer python version
	@echo "GPX Analyzer Python version: $(GPX_ANALYZER_LIB_PYTHON_VERSION)"
	@if ! pyenv versions | grep -q $(GPX_ANALYZER_LIB_PYTHON_VERSION); then \
		echo "Installing Python $(GPX_ANALYZER_LIB_PYTHON_VERSION)"; \
		pyenv install $(GPX_ANALYZER_LIB_PYTHON_VERSION); \
	fi
	@pyenv local $(GPX_ANALYZER_LIB_PYTHON_VERSION)
	@$(PYTHON_HOST) -m venv $(GPX_ANALYZER_LIB_PATH)/.venv
	@rm -f .python-version
	@echo "Python 3.11.0 virtual environment created"


install-gpx-analyzer-libraries:
	# Installing GPX Analyzer dependencies
	@(cd $(GPX_ANALYZER_LIB_PATH); \
		source .venv/bin/activate; \
 		pip install -r requirements.txt)
	@echo "Libraries installed"


configure-gpx-analyzer: create-gpx-analyzer-python-venv install-gpx-analyzer-libraries
	@echo "GPX Analyzer configured successfully"

# create-env-file:
# Creates or overwrites the .env file for the production environment.
# It adds required environment variables such as `PYTHON_PATH`, paths to the GPX
# Analyzer script, and Strava integration information (client ID, secret, and redirect URI).
#
# Note:
#   Ensure the following environment variables are set:
#   - GPX_ANALYZER_LIB_PATH
#   - STRAVA_CLIENT_ID
#   - STRAVA_CLIENT_SECRET
#   - STRAVA_REDIRECT_DOMAIN
#
# Usage:
#   make create-env-file
create-env-file:
	@rm -f $(ENV_FILE)
	@touch $(ENV_FILE)

	@echo "PYTHON_PATH=$(GPX_ANALYZER_LIB_PATH)/.venv/bin/python" >> $(ENV_FILE)
	@echo "GPX_ANALYZER_SCRIPT_PATH=$(GPX_ANALYZER_LIB_PATH)/gpx_analyzer.py" >> $(ENV_FILE)
	@echo "FRONTEND_CONSENT_REDIRECT_PAGE=consent-page" >> $(ENV_FILE)
	@echo "# STRAVA Values" >> $(ENV_FILE)
	@echo "STRAVA_REDIRECT_PATH=api/auth/route-provider/strava/access-token" >> $(ENV_FILE)
	@echo "# AI Value" >> $(ENV_FILE)
	@echo "ANTHROPIC_MODEL=claude-3-5-haiku-20241022" >> $(ENV_FILE)

	@echo "Production ENV file created"