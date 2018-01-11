FROM registry.paas.redhat.com/itpaas-blessed-images/rhel7-platops
MAINTAINER Kun Yan <kyan@redhat.com>
EXPOSE 8443

USER root

# Setup Node.js repo
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum clean all && \
    yum -y install \
        nodejs \
      && \
    yum clean all
# Disable node repo
RUN yum-config-manager -q --disable nodesource

# Create app directory
RUN mkdir -p /var/pcm/public

# Switch to application dir
WORKDIR /var/pcm/

# Copy package.json
COPY ./.openshift/package.json /var/pcm/

# Install application server framework
RUN npm install

COPY ./productSortList.txt /var/pcm/public/
COPY ./.openshift/server.js /var/pcm/
COPY ./dist/* /var/pcm/public/

#USER nobody
USER 99

CMD ["npm","run", "start"]
