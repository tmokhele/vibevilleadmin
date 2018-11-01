node('docker') {
 
    stage 'Checkout'
        checkout scm
    stage 'Build & UnitTest'
        sh "docker build -t vibeviller-admin:B${BUILD_NUMBER} -f Dockerfile ."

  

}