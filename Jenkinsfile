node('docker') {
 
    stage 'Checkout'
        checkout scm
    stage 'Build'
        sh "docker build -t vibeviller-admin:B${BUILD_NUMBER} -f Dockerfile ."
  
}