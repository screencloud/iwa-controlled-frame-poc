#!bin/bash

echo $CHROME

pnpm concurrently "pnpm serve -p $PORT" "\"$CHROME\" --enable-features=IsolatedWebApps,IsolatedWebAppDevMode \ --install-isolated-web-app-from-url=http://localhost:$PORT"
