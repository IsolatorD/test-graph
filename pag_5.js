//FUNCIONES DE LA APP
//FUNCIÓN PARA CREAR TEXTO 
function createText(board, coord, options = {}) {
    return board.create('text', coord, options);
}
// FUNCIÓN PARA CREAR UN ELEMENTO (PUNTO, LINEA, CURVA, BOTON, INPUT, ETC )
function createElement(board, typeElement,coord, options = {}) {
    return board.create(typeElement, coord, options);
}

function createBoard (idtagHtml, {
    boundingbox = [-4, 4, 4, -4],
    fixed = false, 
    showInfobox = false, 
    axis = true,                                    
    defaultAxes = {
        y: { ticks: { visible: false, color: ""} }, 
        x: { ticks: { visible: false } }
    },
    grid = {                                         //La  cuadrilla
        visible: true,                                 //Este visible  la cuadrilla del board
        strokeColor: "black"                          
    },     
    showNavigation = false,                         //Botones de navegación en la esquina inferior derecha
    showCopyright = false,                          //Mostrar Derechos de autor 
    // keepAspectRatio: true,
    keyboard = {                                    //Control usando el teclado para cambiar la construcción
        enabled: false,
        dy: 30,
        panShift: true,
        panCtrl: false,
    }
} = {}) {
    return JXG.JSXGraph.initBoard(idtagHtml, {
        boundingbox,
        fixed,
        showInfobox,
        axis,
        defaultAxes,
        grid,
        showNavigation,
        showCopyright,
        keyboard
    })
}

function onClickBoard({ board, event, listToAddPoints = null, pointsHasInput = false, listToAddInputs = null }) {
    let coord = board.getUsrCoordsOfMouse(event), //Obtiene la coordenadas del clic mouse
    x = coord[0],
    y = coord[1]
    const elementsUnderMouse = board.getAllUnderMouse()         //Metodo que Recopila (Array) todos los elementos bajo la posición actual del mouse más las coordenadas de usuario
    console.log(elementsUnderMouse);
    if (elementsUnderMouse.length > 0 && (Array.isArray(elementsUnderMouse[0]) || (elementsUnderMouse[0].elType !== "point" && elementsUnderMouse[1].elType !== "point"))) {
        const point = createPoint(board, [x, y]);                                         
        if (pointsHasInput) {
            const input = createElement(board, 'input', [0.1, 0.2,`( , )`,""], {fixed: true, cssStyle: "width: 40px", anchor: point});
            listToAddInputs.push(input);
        }
        if (listToAddPoints) {
            listToAddPoints.push(point);
        }
    }
}
//FUNCION PARA CREAR PUNTO 
function createPoint(board, coord, options = {name: "", size: 3, needsRegularUpdate: true}) {
    return board.create('point', coord, options);
}

function addEvent(element, event, callback) {
    element.on(event, callback);
}
//FUNCIÓN PARA LIMPIAR TABLERO                  //parametros (board: el tablero donde estan los elementos a borrar.)
function clearBoard(board, listToClear) {      //listToClear : Lista para borrar
    listToClear.forEach(element => {            //recorre cada elemento de la lista 
        board.removeObject(element);            // Remueve cada elemento 
    });
    board.unsuspendUpdate();
}
//FUNCIÓN DE MOVER ELEMENTO 
function moveElement(element, coord, animationTime = 0) {
    element.moveTo(coord, animationTime); //Mueve un elemento	    
}
//FUNCIÓN PARA CREAR TEXTO DE VALIDACIÓN 
function createValidationText(board, variableText, text, coord, options = {}) {
    if (variableText) {                                  //SI EXISTE UN TEXTO 
        board.removeObject(variableText);                //ELIMINA  ESE TEXTO 
    }
    return createText(board, [...coord, text], options);     //LLAMA A LA FUNCION CREAR TEXTO 
}  
    //FUNCION QUE ME VALIDA SI YA HAY UNA IMAGEN DE CORRECTO, 
function createCorrectImage(board, variableImage, urlImage, coord, density, options = {}) {
    if (variableImage) {                                              //SI EXISTE UNA IMAGEN         
        board.removeObject(variableImage);                            //ELIMINA  ESA IMAGEN
    }
    return createElement(board, "image", [urlImage, coord, density], options);           //RETORNA LA IMAGEN DE CORRECTO (CONFETTI)
}

function validateExercise (pointsList, inputsList, pointConfigs, inputSpace) {
    const resultPoints = [];
    const resultInputs = [];
    pointsList.forEach(point => {
        console.log(point.X(), point.Y());
        resultPoints.push([point.X(), point.Y()]);
    });
  
    inputsList.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        console.log(input.coords.usrCoords, inputValues);
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [input.coords.usrCoords[1] - inputSpace[0], input.coords.usrCoords[2] - inputSpace[1]]
        });
    })
    
    const isValidInputs = pointConfigs.every((element) => {
      console.log('---------', element, '---------');
      if (element.isValidable) {
        let existInInputs = resultInputs.find((input) => {
          const x = Math.abs(input.parentPointCoord[0] - element.coord[0]).toFixed(1);
          const y = Math.abs(input.parentPointCoord[1] - element.coord[1]).toFixed(1);
          const isInCorrectArea = (x <= 0.3 && x >= 0) && (y <= 0.3 && y >= 0)
          const isCorrectValue = JSON.stringify(input.value) === JSON.stringify(element.value)
          console.log(element.coord, input.parentPointCoord, input.value, isInCorrectArea, isCorrectValue);
          return isInCorrectArea && isCorrectValue
        })
        return existInInputs
      } else {
        return true
      }
    })
  
    console.log('isValidInputs', isValidInputs);
    // console.log('isPointsInArea', isPointsInArea);
  
    // return isValidInputs && isPointsInArea
    return isValidInputs
  }
// -------------------------------------- EJERCICIO 1
// CREAR TABLERO (LLAMANDO FUNCION DINAMICA)
const board1 = createBoard("box1");
const successResponse = [
    { value: ["2", "1"], coord: [2, 1], hasInput: false, isVisible: false, isValidable: true },
    { value: ["1", "2"], coord: [1, 2], hasInput: false, isVisible: false, isValidable: true },
    { value: ["0", "0"], coord: [0, 0], hasInput: false, isVisible: false, isValidable: true },
    { value: ["-1", "0"], coord: [-1, 0], hasInput: false, isVisible: false, isValidable: true },
    { value: ["1", "0"], coord: [1, 0], hasInput: false, isVisible: false, isValidable: true },
    { value: ["0", "1"], coord: [0, 1], hasInput: false, isVisible: false, isValidable: true },
    { value: ["0", "-1"], coord: [0, -1], hasInput: false, isVisible: false, isValidable: true },
    { value: ["1", "1"], coord: [1, 1], hasInput: false, isVisible: false, isValidable: true },
    { value: ["2", "3"], coord: [2, 3], hasInput: false, isVisible: false, isValidable: true },
    { value: ["2", "-3"], coord: [2, -3], hasInput: false, isVisible: false, isValidable: true },
    { value: ["-3", "2"], coord: [-3, 2], hasInput: false, isVisible: false, isValidable: true },
    { value: ["2", "-2"], coord: [2, -2], hasInput: false, isVisible: false, isValidable: true },
    { value: ["-2", "2"], coord: [-2, 2], hasInput: false, isVisible: false, isValidable: true },
    { value: ["2", "2"], coord: [2, 2], hasInput: false, isVisible: false, isValidable: true },
    // { value: ['e', 'π'], coord: [2.7, 3.14], hasInput: false, isVisible: false, isValidable: true },
    { value: ["2.7", "3.14"], coord: [2.7, 3.14], hasInput: false, isVisible: false, isValidable: true },
]
    // [2, 1], [1, 2] , [0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [1, 1], [2, 3], [2, -3], [-3, 2], [2, -2], [-2, 2], [2, 2]  ]                    //LISTA CON RESPUESTAS CORRECTAS
let points = [];
let inputs = [];
let validationText =  null;
let correctImage = null;
let reset = 0;
let validation = 0;
let respCorrect = 0;
let respIncorrect = 0;
let isCorrectExercise = false;

// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
board1.on("down", (e) =>  onClickBoard({ board: board1, event: e, listToAddPoints: points, pointsHasInput: true, listToAddInputs: inputs }));

// LABEL NUMEROS EN LOS EJES
const labelY = createText(board1, [-0.3, 1.2, "1"], {fixed: true});
const labelX = createText(board1, [1.1, -0.3, "1"], {fixed: true});

// BOTONES
const buttonCheck = createElement(board1, "button", [-3.5, -3.5, "Verificar", () => {
    validation += 1;
    const isValid = validateExercise(points, inputs, successResponse, [0.1, 0.2]);

    if (isValid) {
        validationText = createValidationText(board1, validationText, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 35, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage = createCorrectImage (board1, correctImage, "confetti5.png", [5, -5], [8,3], {fixed: true});
        moveElement(validationText, [-2, 3], 1000);
        moveElement(correctImage, [-4, 2], 1000);
        if (!isCorrectExercise) {
            
            // if (respCorrect == 0) {
            //     respCorrect += 1;
            // }
            respCorrect += 1;
            isCorrectExercise = true;
        }
    } else {
        validationText = createValidationText(board1, validationText, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 21, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText, [-3.8, 3.4], 1000);
        board1.removeObject(correctImage);
        respIncorrect += 1;
        isCorrectExercise = false;
    }
    console.log({isCorrectExercise, respCorrect, respIncorrect, validation, reset});

}]);
 //BOTÓN BORRAR 
const buttonReset = createElement(board1, "button", [-1.7, -3.5, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board1, [...points, ...inputs, validationText, correctImage]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points = [];                                                                   
    inputs = [];
    validationText = null;
    correctImage = null;
    reset += 1
    console.log(points, inputs, validationText, correctImage);
    console.log({isCorrectExercise, respCorrect, respIncorrect, validation, reset});
}]);

//----------------------------- Ejercicio 2
const board2 = createBoard("box2", {boundingbox : [-1, 5, 5, -1.5], grid : { visible: false}}
);
const successResponse2 = [[0, 2], [0, 3], [0, 4], [2, 0], [2, 2],[2,3], [2,4], [3, 2], [4, 2], [4, 3], [4, 4]]                    //LISTA CON RESPUESTAS CORRECTAS
let points2 = [];
let inputs2 = [];
let validationText2 =  null;
let correctImage2 = null;
let reset2 = 0;
let validation2 = 0;
let respCorrect2 = 0;
let respIncorrect2 = 0;
let isCorrectExercise2 = false;
let defaultPoints = [[0, 2], [0, 3], [0, 4], [2, 0], [2, 2],[2,3], [2,4], [3, 2], [4, 2], [4, 3], [4, 4]]

let defaultInputsText =    [[" ", " "], [" ", " "], [0, 4], 
                            [2, 0], [" ", " "],[" "," "], [" "," "], 
                            [3, 2], [" ", " "], [4, 3], [" ", " "]]


// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
// board2.on("down", (e) =>  onClickBoard({ board: board2, event: e, listToAddPoints: points2, roundedValueEvent: true, pointsHasInput: true, listToAddInputs: inputs2 }));

defaultPoints.forEach((element, index) => {
    const pointsdefault = createPoint(board2, element, {fixed: true, size:2, name: ''});
    const defaultinput = createElement(board2, 'input', [-0.3, -0.3,`(${defaultInputsText[index][0]}, ${defaultInputsText[index][1]})`  ,""], {fixed: true, fontSize: 11.5,  cssStyle: "width: 42px", anchor:pointsdefault});
    points2.push(pointsdefault);
    inputs2.push(defaultinput);
});

// BOTONES
const buttonCheck2 = createElement(board2  , "button", [-0.5, -0.9, "Verificar", () => {
    validation2 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points2.forEach(point => {
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs2.forEach(input => {
        const inputValues = input.Value().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push([parseInt(inputValues[0]), parseInt(inputValues[1])]);
    })
    const isValidPoints = successResponse2.every((sR, ir) => {     //método prueba si todos los elementos de la matriz pasan la prueba por la función proporcionada
        let existInPoints = resultPoints.find((pointCoord, index) => {
            return JSON.stringify(pointCoord) === JSON.stringify(sR)
        })
        return existInPoints
    })
    const isValidInputs = successResponse2.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            return JSON.stringify(inp) === JSON.stringify(sR)
        })
        return existInInputs
    })

    const isInputsCorrectInPoints = JSON.stringify(resultInputs) === JSON.stringify(resultPoints);

    if (isValidPoints && isValidInputs && isInputsCorrectInPoints) {
        validationText2 = createValidationText(board2, validationText2, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage2 = createCorrectImage (board2, correctImage2, "confetti5.png", [5, -5], [6,2], {fixed: true});
        moveElement(validationText2, [0.5, 4.1], 1000);
        moveElement(correctImage2, [-1, 3.5], 1000);
        if (!isCorrectExercise2) {
            respCorrect2 += 1;
            isCorrectExercise2 = true;
        }
    } else {
        validationText2 = createValidationText(board2, validationText2, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 21.5, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText2, [-0.90, 4.2], 1000);
        board2.removeObject(correctImage2);
        respIncorrect2 += 1;
        isCorrectExercise2 = false;
    }
    console.log({isCorrectExercise2, respCorrect2, respIncorrect2, validation2, reset2});
}]);

 //BOTÓN BORRAR 
const buttonReset2 = createElement(board2, "button", [1, -0.9, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board2, [...points2, ...inputs2, validationText2, correctImage2]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points2 = [];                                                                   
    inputs2 = [];
    validationText2 = null;
    correctImage2 = null;
    reset2 += 1
    defaultPoints.forEach((element, index) => {
        const pointsdefault = createPoint(board2, element, {fixed: true, size:2, name: ''});
        const defaultinput = createElement(board2, 'input', [-0.3, -0.3,`(${defaultInputsText[index][0]}, ${defaultInputsText[index][1]})`  ,""], {fixed: true, fontSize: 11.5,  cssStyle: "width: 42px", anchor:pointsdefault});
        points2.push(pointsdefault);
        inputs2.push(defaultinput);
    });
    console.log(points2, inputs2, validationText2, correctImage2);
    console.log({isCorrectExercise2, respCorrect2, respIncorrect2, validation2, reset2});
}]);



//----------------------------- Ejercicio 3
const board3 = createBoard("box3", {boundingbox : [-3, 3, 3, -4], grid : {                                         //La  cuadrilla
    visible: false} });
const successResponse3 =   [[-2,2],  [-1,2],  [0,2],  [1,2],  [2,2],  
                            [-2,1],  [-1,1],  [0,1],  [1,1],  [2,1],
                            [-2,0],  [-1,0],  [0,0],  [1,0],  [2,0],
                            [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1],
                            [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2]
                        ]    //LISTA CON RESPUESTAS CORRECTAS
let points3 = [];
let inputs3 = [];
let validationText3 =  null;
let correctImage3 = null;
let reset3 = 0;
let validation3 = 0;
let respCorrect3 = 0;
let respIncorrect3 = 0;
let isCorrectExercise3 = false;
let defaultPoints2 =   [[-2,2],  [-1,2],  [0,2],  [1,2],  [2,2],
                        [-2,1],  [-1,1],  [0,1],  [1,1],  [2,1],
                        [-2,0],  [-1,0],  [0,0],  [1,0],  [2,0],
                        [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1],
                        [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2]
                    ]

let defaultinput2dCorrect = [
    { value: ['-2a','2b'], coord: [-2, 2] },
    { value: ['-a','2b'], coord: [-1, 2] },
    { value: ['0','2b'], coord: [0, 2] },
    { value: ['a','2b'], coord: [1, 2] },
    { value: ['2a','2b'], coord: [2, 2]}, 

    { value: ['-2a', 'b'], coord: [-2, 1] },
    { value: ['-a', 'b'], coord: [-1, 1] },
    { value: ['0', 'b'], coord: [0, 1] },
    { value: ['a', 'b'], coord: [1, 1] },
    { value: ['2a', 'b'], coord: [2, 1] },

    { value: ['-2a', '0'], coord: [-2, 0] },
    { value: ['-a', '0'], coord: [-1, 0] },
    { value: ['0', '0'], coord: [0, 0] },
    { value: ['a', '0'], coord: [1, 0] },
    { value: ['2a', '0'], coord: [2, 0] },

    { value: ['-2a', '-b'], coord: [-2, -1] },
    { value: ['-a', '-b'], coord: [-1, -1] },
    { value: ['0', '-b'], coord: [0, -1] },
    { value: ['a', '-b'], coord: [1, -1] },
    { value: ['2a', '-b'], coord: [2, -1] },

    { value: ['-2a', '-2b'], coord: [-2, -2] },
    { value: ['-a', '-2b'], coord: [-1, -2] },
    { value: ['0', '-2b'], coord: [0, -2] },
    { value: ['a', '-2b'], coord: [1, -2] },
    { value: ['2a', '-2b'], coord: [2, -2] }
]


let defaultinput2d =   [[' ',' '],  [' ',' '], [' ','2b'], [' ',' '], [' ',' '],
                        [' ', ' '],     ['-a', 'b'], [' ', ' '],  [' ', ' '],  [' ', ' '], 
                        [' ', ' '],     [' ', ' '],  [' ', ' '],  ['a ', ' '], [' ', ' '],
                        [' ', ' '],     [' ', ' '],  [' ', '-b'], [' ', ' '],  ['2a', '-b'], 
                        ['-2a', '-2b'], [' ', ' '],   [' ', ' '],  [' ', ' '],  [' ', ' ']
                    ]

// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
// board3.on("down", (e) =>  onClickBoard({ board: board3, event: e, listToAddPoints: points3, roundedValueEvent: true, pointsHasInput: true, listToAddInputs: inputs3 }));


defaultPoints2.forEach((element, index) => {
    const pointsdefault2 = createPoint(board3, element, {fixed: true, name: '', size:2});
    const defaultinput2 = createElement(board3, 'input', [-0.5, -0.4,`(${defaultinput2d[index][0]}, ${defaultinput2d[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault2 });
    points3.push(pointsdefault2);
    inputs3.push(defaultinput2);
});

// BOTONES
const buttonCheck3 = createElement(board3  , "button", [-2.5, -3.5, "Verificar", () => {
    validation3 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points3.forEach(point => {
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs3.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [Math.round(input.coords.usrCoords[1] + 0.5), Math.round(input.coords.usrCoords[2] + 0.4)]
        });
    })
    const isValidPoints = successResponse3.every((sR, ir) => {
        let existInPoints = resultPoints.find((pointCoord) => {
            return JSON.stringify(pointCoord) === JSON.stringify(sR)
        })
        return existInPoints
    })

    const isValidInputs = defaultinput2dCorrect.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            // console.log(inp.value, sR.value);
            return JSON.stringify(inp.value) === JSON.stringify(sR.value) && JSON.stringify(inp.parentPointCoord) === JSON.stringify(sR.coord)
        })
        // console.log(existInInputs);
        return existInInputs
    })
    console.log(isValidPoints, isValidInputs);

    if (isValidPoints && isValidInputs) {
        validationText3 = createValidationText(board3, validationText3, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 35, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage3 = createCorrectImage (board3, correctImage3, "confetti5.png", [5, -5], [6,2], {fixed: true});
        moveElement(validationText3, [-1.5, 2], 1000);
        moveElement(correctImage3, [-3, 1.5], 1000);
        if (!isCorrectExercise3) {
            respCorrect3 += 1;
            isCorrectExercise3 = true;
        }
    } else {
        validationText3 = createValidationText(board3, validationText3, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText3, [-2.7, 2.2], 1000);
        board3.removeObject(correctImage3);
        respIncorrect3 += 1;
        isCorrectExercise3 = false;
    }
    console.log({isCorrectExercise3, respCorrect3, respIncorrect3, validation3, reset3});

}]);

 //BOTÓN BORRAR 
const buttonReset3 = createElement(board3, "button", [-1, -3.5, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board3, [...points3, ...inputs3, validationText3, correctImage3]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points3 = [];                                                                   
    inputs3 = [];
    validationText3 = null;
    correctImage3 = null;
    reset3 += 1
    defaultPoints2.forEach((element, index) => {
        const pointsdefault2 = createPoint(board3, element, {fixed: true, name: ''});
        const defaultinput2 = createElement(board3, 'input', [-0.5, -0.4,`(${defaultinput2d[index][0]}, ${defaultinput2d[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault2 });
        points3.push(pointsdefault2);
        inputs3.push(defaultinput2);
    });
    console.log(points3, inputs3, validationText3, correctImage3);
    console.log({isCorrectExercise3, respCorrect3, respIncorrect3, validation3, reset3});
}]);

// ---------------- Boton Enviar 

const btnSend = document.querySelector("#btnSend");


function sendData(reset,validation, respCorrect, respIncorrect ) {
    const data =[
        {
            reset: reset,
            validation: validation,
            respCorrect: respCorrect,
            respIncorrect: respIncorrect,
        },
        {
            reset: reset2,
            validation: validation2,
            respCorrect: respCorrect2,
            respIncorrect: respIncorrect2,
        },
        {
            reset: reset3,
            validation: validation3,
            respCorrect: respCorrect3,
            respIncorrect: respIncorrect3,
        }
    ]
    
    // const paramRequest = {
    //     method : "POST",
    //     mode: "cors",
    //     headers : {"Content-Type": "application/json; charset= UTF-8"},
    //     body: JSON.stringify(data),
    // };
    // const myRequest = new Request (endPoint, paramRequest);
    // fetch(myRequest)
    //     .then((res) => res.json())
    //     .then((res) => console.log("Success" + res))
    //     .catch((error) => console.log(error));

    console.log(data);
    //aqui
}

btnSend.addEventListener("click", () => sendData(reset,validation, respCorrect, respIncorrect));    

