FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    nmap \
    netcat-openbsd \
    python3 \
    python3-pip \
    iputils-ping \
    dnsutils \
    vim-tiny \
    less \
    && pip3 install --no-cache-dir requests \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash -u 1000 learner

# Copy workspace files
COPY files/ /home/learner/workspace/

RUN chown -R learner:learner /home/learner

USER learner
WORKDIR /home/learner/workspace

CMD ["/bin/bash"]
