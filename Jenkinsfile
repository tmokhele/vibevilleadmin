pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                checkout scm

                script {
                    def pom = readMavenPom file: 'pom.xml'
                    echo "The pom version is ${pom.artifactId}-${pom.version}"
                    env.VERSION = pom.version.replace("-SNAPSHOT", ".${currentBuild.number}")
                    env.ARTIFACT = pom.artifactId
                    env.binary = "${env.ARTIFACT}-${env.VERSION}"
                }

                //sh "${tool 'mvn'}/bin/mvn release:update-versions release:prepare release:perform -Dmaven.test.failure.ignore=true -Dmaven.test.skip=true -DskipTests -Dmaven.javadoc.failOnError=false -e -DpushChanges=false"
                //sh "${tool 'mvn'}/bin/mvn clean install -DskipTests"
                sh "${tool 'mvn'}/bin/mvn versions:set -DnewVersion=${env.VERSION}"
                sh "${tool 'mvn'}/bin/mvn deploy -Dversion=${env.VERSION} -Djar.finalName=${env.binary} -B"

                sh "docker build -t registry:5001/connect/${env.binary} --build-arg POM_VERSION=${env.VERSION} --build-arg ARTIFACT=${env.ARTIFACT} ."
                sh "docker push registry:5001/connect/${env.binary}"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh "echo 'IMAGE=registry:5001/connect/${env.binary}' > envfile"
                sh "rancher-compose -e envfile --url 'http://rancher.dstvo.local:8080' --access-key 'F52B4290A742239E565E' --secret-key 'Q2uQ9ZZX4DPyrUCt2znQHSvRC9sDuFou3QiWSggg' --project-name 'product-codes-service-qa' -f docker/docker-compose-qa.yml up -d"
            }
        }
        stage('QA') {
            steps {
                build job: '/deploy-using-rundeck', parameters: [string(name: 'pom_version', value: env.VERSION), string(name: 'artifact_id', value: env.ARTIFACT), string(name: 'run_profile', value: 'qa'), string(name: 'maven_repo', value: 'http://10.10.4.140:8081/nexus/content/repositories/releases/com/dstvdm/connect/'), string(name: 'rundeck_job_id', value: '420')]
            }
        }
    }
}
