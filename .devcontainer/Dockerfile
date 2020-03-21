# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.108.0/containers/debian-10-git/.devcontainer/Dockerfile
FROM sam3ay/ask-cli:latest
LABEL maintainer="Sam AY <sam3ay@gmail.com>"

ARG USERNAME=node

RUN mkdir -p /home/$USERNAME/.vscode-server/extensions \
	/home/$USERNAME/.vscode-server-insiders/extensions \
	&& chown -R $USERNAME \
	/home/$USERNAME/.vscode-server \
	/home/$USERNAME/.vscode-server-insiders
