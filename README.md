# ILearnMachineLearning.js

## Description

Thanks to this project I could combine my knowledge from two areas: machine learning and web development. The whole application is written in React using TypeScript and Redux, but the engine that drives it is [TensorFlow.js][1] - a modern library for training and deploying machine learning models. You can find a working app [here][2] or play with it on your computer.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run 
```

## MNIST

[MNIST][3] dataset is widely known in the field of machine learning. It contains about 70000 examples of handwritten digits. Photos are black and white, normalized to fit into a 28x28 pixel bounding box and anti-aliased. This iconic dataset was used to train the model in Keras and then turned into a form understandable to TensorFlow.js and used as the heart of the first project. Check how it's doing ...

<p align="center"> 
<img src="docs/mnist_project.gif">
</p>

## Build Keras models

If you are interested in neural networks and would like to know how to create models used in this project, I encourage you to test the scripts on your computer.

``` bash
# clone repository
git clone https://github.com/SkalskiP/ILearnMachineLearning.js.git

# navigate to models directory
cd ILearnMachineLearning.js/models

# install all required packages and dependencies as well as python environment
./setup.sh

# activate python environment
source .env/bin/activate
```

## Related projects

If you're interested in machine learning, check out my other [projects][4] and check my profile on [Kaggle][5].

## Read more about In-Browser ML

1. [TensorFlow.js Tutorials & Guides][6]
2. [Introducing TensorFlow.js: Machine Learning in Javascript][7]
3. [Neural Network 3D Simulation][8]

[1]: https://github.com/tensorflow/tfjs
[2]: https://learn-machine-learning.herokuapp.com/
[3]: http://yann.lecun.com/exdb/mnist/
[4]: https://github.com/SkalskiP/ILearnMachineLearning.py
[5]: https://www.kaggle.com/skalskip
[6]: https://js.tensorflow.org/tutorials/
[7]: https://medium.com/tensorflow/introducing-tensorflow-js-machine-learning-in-javascript-bf3eab376db
[8]: https://www.youtube.com/watch?v=3JQ3hYko51Y
