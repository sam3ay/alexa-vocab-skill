# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.108.0/containers/debian-10-git/.devcontainer/Dockerfile
FROM sam3ay/node-dev:latest
LABEL maintainer="Sam AY <sam3ay@gmail.com>"

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

USER root

RUN mkdir -p /home/$USERNAME/.vscode-server/extensions \
    /home/$USERNAME/.vscode-server-insiders/extensions \
    && mkdir ${HOME}/.ask \
    && mkdir ${HOME}/.aws \
    && chown -R $USER_UID:$USER_GID /home/${USERNAME} \
    /home/$USERNAME/.vscode-server \
    /home/$USERNAME/.vscode-server-insiders

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/data/.bash_history" \
    && echo $SNIPPET >> "/home/$USERNAME/.bashrc" 

WORKDIR ${HOME}/app

# install ask-cli and aws-cli
RUN npm install -g ask-cli severless\
    && npm install --only=dev jest \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws/

USER ${USERNAME}