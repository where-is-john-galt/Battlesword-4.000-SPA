FROM mcr.microsoft.com/playwright:v1.64.0-noble

RUN npm install --global opencode-ai@1.19.0 \
  && opencode --version | grep -F '1.19.0'

ENV HOME=/tmp/autodev-home
WORKDIR /workspace
