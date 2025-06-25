FROM node:slim

# Install necessary dependencies including xvfb and xauth
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libvulkan1 \
  libxss1 \
  libxcb-dri3-0 \
  libxshmfence1 \
  libgl1 \
  libgbm1 \
  xvfb \
  xauth \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Google Chrome Stable
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy your app code
COPY . .

# Set Puppeteer to use installed Chrome
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"

# Run your automation with virtual display
CMD bash -c "DISPLAY=:1 npm run dev"
