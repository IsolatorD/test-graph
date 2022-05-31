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
    showInfobox = true, 
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

function onClickBoard({ board, event, roundedValueEvent = false, listToAddPoints = null, pointsHasInput = false, listToAddInputs = null }) {
    let coord = board.getUsrCoordsOfMouse(event) //Obtiene la coordenadas del clic mouse
    let x = roundedValueEvent ? Math.round(coord[0]) : coord[0] //Redondea la coordenada a un numero entero
    let y = roundedValueEvent ? Math.round(coord[1]) : coord[1]
    
    const elementsUnderMouse = board.getAllUnderMouse()         //Metodo que Recopila (Array) todos los elementos bajo la posición actual del mouse más las coordenadas de usuario
    console.log(elementsUnderMouse);
    let input= null
    if (elementsUnderMouse.length > 0 && (Array.isArray(elementsUnderMouse[0]) || (elementsUnderMouse[0].elType !== "point" && elementsUnderMouse[1].elType !== "point"))) {
        const point = createPoint(board, [x, y], {fixed: true, name: '', size:1, visible: true});                                         
        if (pointsHasInput) {
            input = createElement(board, 'input', [0.1, 0.2,`(  ,  )`,""],  {fixed: true, cssStyle: "width: 40px", fontSize: 9.8, anchor: point});
            listToAddInputs.push(input);
        }
        if (roundedValueEvent) {
            addEvent(point, 'drag', () => onDragPoint(point));
        }
        if (listToAddPoints) {
            listToAddPoints.push(point);
        }
    }
}

function validation(listPointCorrect , listAddpoints) {
    console.log("><")
    // if(listPointCorrect.length != listAddpoints.length){
    //     return false;
    // };
    let result = listPointCorrect.every((element, index)=> {
        const isValid = resultPoints.some((elemento)=>{
            // ( elemento[0]- element[0])Math. +( elemento[1]- element[1])
            let resp = false
            const x = Math.abs(elemento[0] - element[0]).toFixed(1);
            const y = Math.abs(elemento[1] - element[1]).toFixed(1);
            // const result= Math.pow(x * x + y * y, 2);
            console.log('Punto usuario', elemento);
            console.log(x, y, 'Punto correcto: ', element);
            if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                resp = true;
            }
            console.log('Cerca o no', resp);
            return resp
        });
        return isValid;
    });
    console.log('Result: ', result);
    // return resp
}

//FUNCION PARA CREAR PUNTO 
function createPoint(board, coord, options = {name: "", size: 1, needsRegularUpdate: true}) {
    return board.create('point', coord, options);
}
//FUNCION PARA ARRASTRAR PUNTO 
function onDragPoint (point) {
    const x = Math.round(point.X()) //Redondea la point.X()en un numero entero
    const y = Math.round(point.Y());
    point.moveTo([x, y], 0); //Mueve un punto
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

//------------------------------ Ejercicio 1
const successResponse3 =   [[0.5, -2.5] , [-0.5, 2.5] ,  [-0.5, -2.5], [2.5, 0.5]]    //LISTA CON RESPUESTAS CORRECTAS

let points3 = [];
let inputs3 = [];
let validationText3 =  null;
let correctImage3 = null;
let reset3 = 0;
let validation3 = 0;
let respCorrect3 = 0;
let respIncorrect3 = 0;
let isCorrectExercise3 = false;
let defaultPoints3 =   [[3.2, 2.2] , [-0.8, 2.2]  ]

let defaultinputCorrect3 = [
    { value: ['x','-y'], coord: [0.5, -2.5] },
    { value: ['-x','y'], coord: [-0.5, 2.5] },
    // { value: ['x','y'], coord: [0.5,0 -2.5]}

    { value: ['-x','-y'], coord: [-0.5, -2.5] },
    { value: ['y','x'], coord: [2.5, 0.5] }
]

const board3 = createBoard("box1", {boundingbox : [-4, 4, 4, -4], grid : { visible: true} });

defaultinputCorrect3.forEach((element, index) => {
    const pointsdefault3 = createPoint(board3,[ element.coord[0], element.coord[1]], {fixed: true, name: '', size:1, visible: false});
    // const defaultinput1 = createElement(board3, 'input', [-0.5, -0.4,`(${element.value[0]}, ${element.value[1]})`  ,""], {fixed: true, visible: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault3 });
});
            
            // AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
board3.on("down", (e) =>  onClickBoard({ board: board3, event: e, listToAddPoints: points3, pointsHasInput: true, listToAddInputs: inputs3 }));
            
const puntoPlano3 = createPoint(board3,[ 0.5, 2.5], {fixed: true, name: '', size:1, visible: true});
const inputPlano3 = createElement(board3, 'input', [-0.5, -0.4,`( x , y )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano3 });
            
            // BOTONES
const buttonCheck3 = createElement(board3  , "button", [-3.5, -3.5, "Verificar", () => {
    validation3 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points3.forEach(point => {
        console.log(point.X(), point.Y());
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs3.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [input.coords.usrCoords[1] - 0.1, input.coords.usrCoords[2] - 0.2]
        });
    })
                // const isValidPoints = successResponse1.every((sR, ir) => {
                //     let existInPoints = resultPoints.find((pointCoord) => {
                //         return JSON.stringify(pointCoord) === JSON.stringify(sR)
                //     })
                //     return existInPoints
                // })
            
    const isValidInputs = defaultinputCorrect3.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            return JSON.stringify(inp.value) === JSON.stringify(sR.value)
        })
        // console.log('isValidInputs every', existInInputs, sR);
        return existInInputs
    })
            
    const isPointsInArea = defaultinputCorrect3.every((element, index) => {
        const isValid = resultPoints.some((elemento) => {
            let resp = false
            let input = resultInputs.find((inputElement) => {
                console.log('Input', inputElement.parentPointCoord[0], inputElement.parentPointCoord[1]);
                console.log('Point', elemento)
                return inputElement.parentPointCoord[0] === elemento[0] && inputElement.parentPointCoord[1] === elemento[1]
            })
            console.log('input encontrado', input);
            const x = Math.abs(elemento[0] - element.coord[0]).toFixed(1);
            const y = Math.abs(elemento[1] - element.coord[1]).toFixed(1);
            if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                resp = true;
            }
            return resp
        });
        return isValid;
    });
            
    console.log('Final: ', isValidInputs, isPointsInArea);
    
    if (isValidInputs && isPointsInArea) {
        validationText3 = createValidationText(board3, validationText3, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage3 = createCorrectImage (board3, correctImage3, "confetti5.png", [5, -5], [8,2], {fixed: true});
        moveElement(validationText3, [-3.5, 2.5], 1000);
        moveElement(correctImage3, [-4, 2.7], 1000);
        if (!isCorrectExercise3) {
            respCorrect3 += 1;
            isCorrectExercise3 = true;
        }
    } else {
        validationText3 = createValidationText(board3, validationText3, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText3, [-3.7, 3.2], 1000);
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
    // defaultpoints3.forEach((element, index) => {
    //     const pointsdefault3 = createPoint(board3, element, {fixed: true, name: ''});
    //     const defaultinput1 = createElement(board3, 'input', [-0.5, -0.4,`(${defaultinputText1[index][0]}, ${defaultinputText1[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault3 });
    //     points3.push(pointsdefault3);
    //     inputs3.push(defaultinput1);
    // });
    console.log(points3, inputs3, validationText3, correctImage3);
    console.log({isCorrectExercise3, respCorrect3, respIncorrect3, validation3, reset3});
}]);

//------------------------------ Ejercicio 2



    const successResponse2 =   [[-1, 0] , [-1, -1] , /* [2, -2], [2, 1], [-2, 2], [1, 1]*/]    //LISTA CON RESPUESTAS CORRECTAS

    let points2 = [];
    let inputs2 = [];
    let validationText2 =  null;
    let correctImage2 = null;
    let reset2 = 0;
    let validation2 = 0;
    let respCorrect2 = 0;
    let respIncorrect2 = 0;
    let isCorrectExercise2 = false;
    let defaultpoints2 =   [[3.2, 2.2] , [-0.8, 2.2]  ]

        let defaultinputCorrect2 = [
            { value: ['b','0'], coord: [-1, 0] },
            { value: ['b','b'], coord: [-1, -1] },
            { value: ['a','-a'], coord: [2, -2] },
            { value: ['-a','-b'], coord: [2, 1] },
            { value: ['a','-a'], coord: [-2, 2] },
            { value: ['-b','-b'], coord: [1, 1] }
        ]
    
        const board2 = createBoard("box2", {boundingbox : [-4, 4, 4, -4], grid : {                                         //La  cuadrilla
            visible: true} });;

            defaultinputCorrect2.forEach((element, index) => {
                const pointsdefault3 = createPoint(board2,[ element.coord[0], element.coord[1]], {fixed: true, name: '', size:1, visible: false});
                // const defaultinput1 = createElement(board2, 'input', [-0.5, -0.4,`(${element.value[0]}, ${element.value[1]})`  ,""], {fixed: true, visible: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault3 });
            });
            
            // AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
            board2.on("down", (e) =>  onClickBoard({ board: board2, event: e, listToAddPoints: points2, pointsHasInput: true, listToAddInputs: inputs2 }));
            
            const puntoPlano2 = createPoint(board2,[2, 0], {fixed: true, name: '', size:1, visible: true});
            const inputPlano2= createElement(board2, 'input', [-0.5, -0.4,`( a , 0 )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano2 });
            
            const puntoPlano_2 = createPoint(board2,[ 0, -1], {fixed: true, name: '', size:1, visible: true});
            const inputPlano_2= createElement(board2, 'input', [-0.5, -0.4,`( 0 , b )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano_2 })

            // BOTONES
            const buttonCheck2 = createElement(board2  , "button", [-3.5, -3.5, "Verificar", () => {
                validation2 += 1;
                const resultPoints = [];
                const resultInputs = [];
                points2.forEach(point => {
                    console.log(point.X(), point.Y());
                    resultPoints.push([point.X(), point.Y()]);
                });
                inputs2.forEach(input => {
                    const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
                    resultInputs.push({
                        value: [inputValues[0], inputValues[1]],
                        parentPointCoord: [input.coords.usrCoords[1] - 0.1, input.coords.usrCoords[2] - 0.2]
                    });
                })
                // const isValidPoints = successResponse1.every((sR, ir) => {
                //     let existInPoints = resultPoints.find((pointCoord) => {
                //         return JSON.stringify(pointCoord) === JSON.stringify(sR)
                //     })
                //     return existInPoints
                // })
            
                const isValidInputs = defaultinputCorrect2.every((sR, ir) => {
                    let existInInputs = resultInputs.find((inp, index) => {
                        // console.log(inp.value, sR.value);
                        // console.log(inp.parentPointCoord, sR.coord);
                        return JSON.stringify(inp.value) === JSON.stringify(sR.value)
                    })
                    // console.log('isValidInputs every', existInInputs, sR);
                    return existInInputs
                })
            
                const isPointsInArea = defaultinputCorrect2.every((element, index) => {
                    const isValid = resultPoints.some((elemento) => {
                        let resp = false
                        let input = resultInputs.find((inputElement) => {
                            console.log('Input', inputElement.parentPointCoord[0], inputElement.parentPointCoord[1]);
                            console.log('Point', elemento)
                            return inputElement.parentPointCoord[0] === elemento[0] && inputElement.parentPointCoord[1] === elemento[1]
                        })
                        console.log('input encontrado', input);
                        const x = Math.abs(elemento[0] - element.coord[0]).toFixed(1);
                        const y = Math.abs(elemento[1] - element.coord[1]).toFixed(1);
                        if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                            resp = true;
                        }
                        return resp
                    });
                    return isValid;
                });
            
                console.log('Final: ', isValidInputs, isPointsInArea);
            
                if (isValidInputs && isPointsInArea) {
                    validationText2 = createValidationText(board2, validationText2, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
                    correctImage2 = createCorrectImage (board2, correctImage2, "confetti5.png", [5, -5], [8,2], {fixed: true});
                    moveElement(validationText2, [-3.5, 2.5], 1000);
                    moveElement(correctImage2, [-4, 2.7], 1000);
                    if (!isCorrectExercise2) {
                        respCorrect2 += 1;
                        isCorrectExercise2 = true;
                    }
                } else {
                    validationText2 = createValidationText(board2, validationText2, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
                    moveElement(validationText2, [-3.7, 3.2], 1000);
                    board2.removeObject(correctImage2);
                    respIncorrect2 += 1;
                    isCorrectExercise2 = false;
                }
                console.log({isCorrectExercise2, respCorrect2, respIncorrect2, validation2, reset2});
            
            }]);
            
             //BOTÓN BORRAR 
            const buttonReset2 = createElement(board2, "button", [-1, -3.5, "Borrar", () => {  //Se crea el boton de Borrar
                clearBoard(board2, [...points2, ...inputs2, validationText2, correctImage2]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
                points2 = [];                                                                   
                inputs2 = [];
                validationText2 = null;
                correctImage2 = null;
                reset2 += 1
                // defaultpoints2.forEach((element, index) => {
                //     const pointsdefault3 = createPoint(board2, element, {fixed: true, name: ''});
                //     const defaultinput1 = createElement(board2, 'input', [-0.5, -0.4,`(${defaultinputText1[index][0]}, ${defaultinputText1[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault3 });
                //     points2.push(pointsdefault3);
                //     inputs2.push(defaultinput1);
                // });
                console.log(points2, inputs2, validationText2, correctImage2);
                console.log({isCorrectExercise2, respCorrect2, respIncorrect2, validation2, reset2});
            }]);





// -------------------------------------- EJERCICIO 3  PAGINA 11
// CREAR TABLERO (LLAMANDO FUNCION DINAMICA)



const successResponse1 =   [[-0.8 , -2.2] , [3.2, 2.2] , [1.2, 0.2], [1.2, 4.2], [-0.8, 0.2], [3.2, 4.2]]    //LISTA CON RESPUESTAS CORRECTAS

let points1 = [];
let inputs1 = [];
let validationText1 =  null;
let correctImage1 = null;
let reset1 = 0;
let validation1 = 0;
let respCorrect1 = 0;
let respIncorrect1 = 0;
let isCorrectExercise1 = false;
let defaultPoints1 =   [[3.2, 2.2] , [-0.8, 2.2]  ]


let resultPoints =[]
let point =[[3.2, 2.2, "x+2, y"],[-0.8, 2.2, "x-2, y"]];

const resultPoints2 = [];

let defaultinputCorrect1 = [
    { value: ['x-2','y'], coord: [-0.8, 2.2] },
    { value: ['x+2','y'], coord: [3.2, 2.2] },
   // { value: ['x','y'], coord: [1.2, 2.2]}

    { value: ['x','y-2'], coord: [1.2, 0.2] },
    { value: ['x','y+2'], coord: [1.2, 4.2] },
    { value: ['x-2','y-2'], coord: [-0.8, 0.2] },
    { value: ['x+2','y+2'], coord: [3.2, 4.2] }
]

let defaultinputText1 =   [['x','y']]
                    

const board1 = createBoard("box3", {boundingbox : [-5, 5, 5, -5], grid : {                                         //La  cuadrilla
visible: true} });;

defaultinputCorrect1.forEach((element, index) => {
    const pointsdefault1 = createPoint(board1,[ element.coord[0], element.coord[1]], {fixed: true, name: '', size:1, visible: false});
    // const defaultinput1 = createElement(board1, 'input', [-0.5, -0.4,`(${element.value[0]}, ${element.value[1]})`  ,""], {fixed: true, visible: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault1 });
});

// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
board1.on("down", (e) =>  onClickBoard({ board: board1, event: e, listToAddPoints: points1, pointsHasInput: true, listToAddInputs: inputs1 }));

const puntoPlano  = createPoint(board1,[ 1.2, 2.2], {fixed: true, name: '', size:1, visible: true});
const inputPlano= createElement(board1, 'input', [-0.5, -0.4,`( x , y )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano });

// BOTONES
const buttonCheck1 = createElement(board1  , "button", [-3.5, -4.2, "Verificar", () => {
    validation1 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points1.forEach(point => {
        console.log(point.X(), point.Y());
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs1.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [input.coords.usrCoords[1] - 0.1, input.coords.usrCoords[2] - 0.2]
        });
    })
    // const isValidPoints = successResponse1.every((sR, ir) => {
    //     let existInPoints = resultPoints.find((pointCoord) => {
    //         return JSON.stringify(pointCoord) === JSON.stringify(sR)
    //     })
    //     return existInPoints
    // })

    const isValidInputs = defaultinputCorrect1.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            // console.log(inp.value, sR.value);
            // console.log(inp.parentPointCoord, sR.coord);
            return JSON.stringify(inp.value) === JSON.stringify(sR.value)
        })
        // console.log('isValidInputs every', existInInputs, sR);
        return existInInputs
    })

    const isPointsInArea = defaultinputCorrect1.every((element, index) => {
        const isValid = resultPoints.some((elemento) => {
            let resp = false
            let input = resultInputs.find((inputElement) => {
                console.log('Input', inputElement.parentPointCoord[0], inputElement.parentPointCoord[1]);
                console.log('Point', elemento)
                return inputElement.parentPointCoord[0] === elemento[0] && inputElement.parentPointCoord[1] === elemento[1]
            })
            console.log('input encontrado', input);
            const x = Math.abs(elemento[0] - element.coord[0]).toFixed(1);
            const y = Math.abs(elemento[1] - element.coord[1]).toFixed(1);
            if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                resp = true;
            }
            return resp
        });
        return isValid;
    });

    console.log('Final: ', isValidInputs, isPointsInArea);

    if (isValidInputs && isPointsInArea) {
        validationText1 = createValidationText(board1, validationText1, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage1 = createCorrectImage (board1, correctImage1, "confetti5.png", [5, -5], [10,2], {fixed: true});
        moveElement(validationText1, [-4.5, 3.5], 1000);
        moveElement(correctImage1, [-5, 3.5], 1000);
        if (!isCorrectExercise1) {
            respCorrect1 += 1;
            isCorrectExercise1 = true;
        }
    } else {
        validationText1 = createValidationText(board1, validationText1, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText1, [-3.7, 3.2], 1000);
        board1.removeObject(correctImage1);
        respIncorrect1 += 1;
        isCorrectExercise1 = false;
    }
    console.log({isCorrectExercise1, respCorrect1, respIncorrect1, validation1, reset1});

}]);

 //BOTÓN BORRAR 
const buttonReset1 = createElement(board1, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board1, [...points1, ...inputs1, validationText1, correctImage1]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points1 = [];                                                                   
    inputs1 = [];
    validationText1 = null;
    correctImage1 = null;
    reset1 += 1
    // defaultPoints1.forEach((element, index) => {
    //     const pointsdefault1 = createPoint(board1, element, {fixed: true, name: ''});
    //     const defaultinput1 = createElement(board1, 'input', [-0.5, -0.4,`(${defaultinputText1[index][0]}, ${defaultinputText1[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault1 });
    //     points1.push(pointsdefault1);
    //     inputs1.push(defaultinput1);
    // });
    console.log(points1, inputs1, validationText1, correctImage1);
    console.log({isCorrectExercise1, respCorrect1, respIncorrect1, validation1, reset1});
}]);


;






 //-------------------------------- Ejercicio 4


const successResponse4 =   [[4.4 , 0.8] , [2.2, 1.8] , /*[1.1, 0.8], [2.2, 0.4], [4.4, -0.8], [1.1, 0.4]*/]    //LISTA CON RESPUESTAS CORRECTAS

let points4 = [];
let inputs4 = [];
let validationText4 =  null;
let correctImage4 = null;
let reset4 = 0;
let validation4 = 0;
let respCorrect4 = 0;
let respIncorrect4 = 0;
let isCorrectExercise4 = false;
let defaultPoints4 =   [[3.2, 2.2] , [-0.8, 2.2]  ]


let defaultinputCorrect4 = [
    { value: ['2x','y'], coord: [4.4 , 0.8] },
    { value: ['x','2y'], coord:  [2.2, 1.6] },


  /*  { value: ['x/2','y'], coord: [1.1, 0.8] },
    { value: ['x','y/2'], coord: [2.2, 0.4] },
    { value: ['2x','-y'], coord: [4.4, -0.8] },
    { value: ['x/2','y/2'], coord: [1.1, 0.4] } */
]

let defaultinputText4 =   [['x','y']]
                    

const board4 = createBoard("box4", {boundingbox : [-5, 5, 5.4, -5], grid : {                                         //La  cuadrilla
visible: true} });;

defaultinputCorrect4.forEach((element, index) => {
    const pointsdefault1 = createPoint(board4,[ element.coord[0], element.coord[1]], {fixed: true, name: '', size:1, visible: false});
    // const defaultinput1 = createElement(board4, 'input', [-0.5, -0.4,`(${element.value[0]}, ${element.value[1]})`  ,""], {fixed: true, visible: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault1 });
});

// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
board4.on("down", (e) =>  onClickBoard({ board: board4, event: e, listToAddPoints: points4, pointsHasInput: true, listToAddInputs: inputs4 }));

const puntoPlano4  = createPoint(board4,[ 2.2, 0.8], {fixed: true, name: '', size:1, visible: true});
const inputPlano4= createElement(board4, 'input', [-0.5, -0.4,`( x , y )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano4 });

// BOTONES
const buttonCheck4 = createElement(board4  , "button", [-3.5, -4.2, "Verificar", () => {
    validation4 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points4.forEach(point => {
        console.log(point.X(), point.Y());
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs4.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [input.coords.usrCoords[1] - 0.1, input.coords.usrCoords[2] - 0.2]
        });
    })
    // const isValidPoints = successResponse4.every((sR, ir) => {
    //     let existInPoints = resultPoints.find((pointCoord) => {
    //         return JSON.stringify(pointCoord) === JSON.stringify(sR)
    //     })
    //     return existInPoints
    // })

    const isValidInputs = defaultinputCorrect4.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            // console.log(inp.value, sR.value);
            // console.log(inp.parentPointCoord, sR.coord);
            return JSON.stringify(inp.value) === JSON.stringify(sR.value)
        })
        // console.log('isValidInputs every', existInInputs, sR);
        return existInInputs
    })

    const isPointsInArea = defaultinputCorrect4.every((element, index) => {
        const isValid = resultPoints.some((elemento) => {
            let resp = false
            let input = resultInputs.find((inputElement) => {
                console.log('Input', inputElement.parentPointCoord[0], inputElement.parentPointCoord[1]);
                console.log('Point', elemento)
                return inputElement.parentPointCoord[0] === elemento[0] && inputElement.parentPointCoord[1] === elemento[1]
            })
            console.log('input encontrado', input);
            const x = Math.abs(elemento[0] - element.coord[0]).toFixed(1);
            const y = Math.abs(elemento[1] - element.coord[1]).toFixed(1);
            if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                resp = true;
            }
            return resp
        });
        return isValid;
    });

    console.log('Final: ', isValidInputs, isPointsInArea);

    if (isValidInputs && isPointsInArea) {
        validationText4 = createValidationText(board4, validationText4, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage4 = createCorrectImage (board4, correctImage4, "confetti5.png", [5, -5], [10,2], {fixed: true});
        moveElement(validationText4, [-4.5, 4], 1000);
        moveElement(correctImage4, [-5, 3.5], 1000);
        if (!isCorrectExercise4) {
            respCorrect4 += 1;
            isCorrectExercise4 = true;
        }
    } else {
        validationText4 = createValidationText(board4, validationText4, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText4, [-4.5, 4], 1000);
        board4.removeObject(correctImage4);
        respIncorrect4 += 1;
        isCorrectExercise4 = false;
    }
    console.log({isCorrectExercise4, respCorrect4, respIncorrect4, validation4, reset4});

}]);

 //BOTÓN BORRAR 
const buttonReset4 = createElement(board4, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board4, [...points4, ...inputs4, validationText4, correctImage4]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points4 = [];                                                                   
    inputs4 = [];
    validationText4 = null;
    correctImage4 = null;
    reset4 += 1
    // defaultpoints4.forEach((element, index) => {
    //     const pointsdefault1 = createPoint(board4, element, {fixed: true, name: ''});
    //     const defaultinput1 = createElement(board4, 'input', [-0.5, -0.4,`(${defaultinputText1[index][0]}, ${defaultinputText1[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault1 });
    //     points4.push(pointsdefault1);
    //     inputs4.push(defaultinput1);
    // });
    console.log(points4, inputs4, validationText4, correctImage4);
    console.log({isCorrectExercise4, respCorrect4, respIncorrect4, validation4, reset4});
}]);



//-------------------------------- Ejercicio 5




const successResponse5 =   [[0.8 , 0] , [0, 2.2] , [2.2, 0], [0, 0.8], [2.2, 2.2], [0.8, 0.4]]    //LISTA CON RESPUESTAS CORRECTAS

let points5 = [];
let inputs5 = [];
let validationText5 =  null;
let correctImage5 = null;
let reset5 = 0;
let validation5 = 0;
let respCorrect5 = 0;
let respIncorrect5 = 0;
let isCorrectExercise5 = false;
let defaultPoints5 =   [[3.2, 2.2] , [-0.8, 2.2]  ]


let defaultinputCorrect5 = [
    { value: ['y','0'], coord: [0.8 , 0]  },
    { value: ['0','x'], coord:  [0, 2.2] },


    { value: ['x','0'], coord: [2.2, 0] },
    { value: ['0','y'], coord: [0, 0.8] },
    { value: ['x','x'], coord: [2.2, 2.2] },
    { value: ['y','y'], coord: [0.8, 0.8] } 
]

let defaultinputText5 =   [['x','y']]
                    

const board5 = createBoard("box5", {boundingbox : [-5, 5, 5.4, -5], grid : {                                         //La  cuadrilla
visible: true} });;

defaultinputCorrect5.forEach((element, index) => {
    const pointsdefault5 = createPoint(board5,[ element.coord[0], element.coord[1]], {fixed: true, name: '', size:1, visible: false});
    // const defaultinput1 = createElement(board5, 'input', [-0.5, -0.4,`(${element.value[0]}, ${element.value[1]})`  ,""], {fixed: true, visible: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault5 });
});

// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
board5.on("down", (e) =>  onClickBoard({ board: board5, event: e, listToAddPoints: points5, pointsHasInput: true, listToAddInputs: inputs5 }));

const puntoPlano5  = createPoint(board5,[ 2.2, 0.8], {fixed: true, name: '', size:1, visible: true});
const inputPlano5= createElement(board5, 'input', [-0.5, -0.4,`( x , y )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano5 });

// BOTONES
const buttonCheck5 = createElement(board5  , "button", [-3.5, -4.2, "Verificar", () => {
    validation5 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points5.forEach(point => {
        console.log(point.X(), point.Y());
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs5.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [input.coords.usrCoords[1] - 0.1, input.coords.usrCoords[2] - 0.2]
        });
    })
    // const isValidPoints = successResponse5.every((sR, ir) => {
    //     let existInPoints = resultPoints.find((pointCoord) => {
    //         return JSON.stringify(pointCoord) === JSON.stringify(sR)
    //     })
    //     return existInPoints
    // })

    const isValidInputs = defaultinputCorrect5.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            // console.log(inp.value, sR.value);
            // console.log(inp.parentPointCoord, sR.coord);
            return JSON.stringify(inp.value) === JSON.stringify(sR.value)
        })
        // console.log('isValidInputs every', existInInputs, sR);
        return existInInputs
    })

    const isPointsInArea = defaultinputCorrect5.every((element, index) => {
        const isValid = resultPoints.some((elemento) => {
            let resp = false
            let input = resultInputs.find((inputElement) => {
                console.log('Input', inputElement.parentPointCoord[0], inputElement.parentPointCoord[1]);
                console.log('Point', elemento)
                return inputElement.parentPointCoord[0] === elemento[0] && inputElement.parentPointCoord[1] === elemento[1]
            })
            console.log('input encontrado', input);
            const x = Math.abs(elemento[0] - element.coord[0]).toFixed(1);
            const y = Math.abs(elemento[1] - element.coord[1]).toFixed(1);
            if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                resp = true;
            }
            return resp
        });
        return isValid;
    });

    console.log('Final: ', isValidInputs, isPointsInArea);

    if (isValidInputs && isPointsInArea) {
        validationText5 = createValidationText(board5, validationText5, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage5 = createCorrectImage (board5, correctImage5, "confetti5.png", [5, -5], [10,2], {fixed: true});
        moveElement(validationText5, [-4.5, 4], 1000);
        moveElement(correctImage5, [-5, 3.5], 1000);
        if (!isCorrectExercise5) {
            respCorrect5 += 1;
            isCorrectExercise5 = true;
        }
    } else {
        validationText5 = createValidationText(board5, validationText5, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText5, [-4.5, 4], 1000);
        board5.removeObject(correctImage5);
        respIncorrect5 += 1;
        isCorrectExercise4 = false;
    }
    console.log({isCorrectExercise4, respCorrect5, respIncorrect5, validation5, reset5});

}]);

 //BOTÓN BORRAR 
const buttonReset5 = createElement(board5, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board5, [...points5, ...inputs5, validationText5, correctImage5]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points5 = [];                                                                   
    inputs5 = [];
    validationText5 = null;
    correctImage5 = null;
    reset5 += 1
    // defaultpoints5.forEach((element, index) => {
    //     const pointsdefault5 = createPoint(board5, element, {fixed: true, name: ''});
    //     const defaultinput1 = createElement(board5, 'input', [-0.5, -0.4,`(${defaultinputText1[index][0]}, ${defaultinputText1[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault5 });
    //     points5.push(pointsdefault5);
    //     inputs5.push(defaultinput1);
    // });
    console.log(points5, inputs5, validationText5, correctImage5);
    console.log({isCorrectExercise5, respCorrect5, respIncorrect5, validation5, reset5});
}]);


//-------------------------------- Ejercicio 6

const successResponse6 =   [[2.2 , 4.2] , [3, 0.8] /*, [2.2, -0.8], [4.2, 1.6], [4.4, 1.6]*/]    //LISTA CON RESPUESTAS CORRECTAS

let points6 = [];
let inputs6 = [];
let validationText6 =  null;
let correctImage6 = null;
let reset6 = 0;
let validation6 = 0;
let respCorrect6 = 0;
let respIncorrect6 = 0;
let isCorrectExercise6 = false;
let defaultPoints6 =   [[3.2, 2.2] , [-0.8, 2.2]  ]


let defaultinputCorrect6 = [
    { value: ['x','x+2'], coord: [2.2 , 4.2]  },
    { value: ['x+y','y'], coord:  [3, 0.8] },


 /*   { value: ['x','-y'], coord: [2.2, -0.8] },
    { value: ['x+2','2y'], coord: [4.2, 1.6] },
    { value: ['2x','2y'], coord: [4.4, 1.6] },*/

]

let defaultinputText6 =   [['x','y']]
                    

const board6 = createBoard("box6", {boundingbox : [-5, 5, 5.4, -5], grid : {                                         //La  cuadrilla
visible: true} });;

defaultinputCorrect6.forEach((element, index) => {
    const pointsdefault5 = createPoint(board6,[ element.coord[0], element.coord[1]], {fixed: true, name: '', size:1, visible: false});
    // const defaultinput1 = createElement(board6, 'input', [-0.5, -0.4,`(${element.value[0]}, ${element.value[1]})`  ,""], {fixed: true, visible: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: pointsdefault5 });
});

// AGREGAR EVENTO CLICK AL TABLER PARA CREAR LOS PUNTOS, USA LA FUNCION DINAMICA PARA CREAR LOS PUNTOS
board6.on("down", (e) =>  onClickBoard({ board: board6, event: e, listToAddPoints: points6, pointsHasInput: true, listToAddInputs: inputs6 }));

const puntoPlano6  = createPoint(board6,[ 2.2, 0.8], {fixed: true, name: '', size:1, visible: true});
const inputPlano6= createElement(board6, 'input', [-0.5, -0.4,`( x , y )` ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 48px", anchor: puntoPlano6 });

// BOTONES
const buttonCheck6 = createElement(board6  , "button", [-3.5, -4.2, "Verificar", () => {
    validation6 += 1;
    const resultPoints = [];
    const resultInputs = [];
    points6.forEach(point => {
        console.log(point.X(), point.Y());
        resultPoints.push([point.X(), point.Y()]);
    });
    inputs6.forEach(input => {
        const inputValues = input.Value().toLowerCase().replaceAll(' ', '').replace('(', '').replace(')', '').split(',');
        resultInputs.push({
            value: [inputValues[0], inputValues[1]],
            parentPointCoord: [input.coords.usrCoords[1] - 0.1, input.coords.usrCoords[2] - 0.2]
        });
    })
    // const isValidPoints = successResponse6.every((sR, ir) => {
    //     let existInPoints = resultPoints.find((pointCoord) => {
    //         return JSON.stringify(pointCoord) === JSON.stringify(sR)
    //     })
    //     return existInPoints
    // })

    const isValidInputs = defaultinputCorrect6.every((sR, ir) => {
        let existInInputs = resultInputs.find((inp, index) => {
            // console.log(inp.value, sR.value);
            // console.log(inp.parentPointCoord, sR.coord);
            return JSON.stringify(inp.value) === JSON.stringify(sR.value)
        })
        // console.log('isValidInputs every', existInInputs, sR);
        return existInInputs
    })

    const isPointsInArea = defaultinputCorrect6.every((element, index) => {
        const isValid = resultPoints.some((elemento) => {
            let resp = false
            let input = resultInputs.find((inputElement) => {
                console.log('Input', inputElement.parentPointCoord[0], inputElement.parentPointCoord[1]);
                console.log('Point', elemento)
                return inputElement.parentPointCoord[0] === elemento[0] && inputElement.parentPointCoord[1] === elemento[1]
            })
            console.log('input encontrado', input);
            const x = Math.abs(elemento[0] - element.coord[0]).toFixed(1);
            const y = Math.abs(elemento[1] - element.coord[1]).toFixed(1);
            if ((x <= 0.3 && x >=0) && (y <= 0.3 && y >= 0)) {
                resp = true;
            }
            return resp
        });
        return isValid;
    });

    console.log('Final: ', isValidInputs, isPointsInArea);

    if (isValidInputs && isPointsInArea) {
        validationText6 = createValidationText(board6, validationText6, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
        correctImage6 = createCorrectImage (board6, correctImage6, "confetti5.png", [5, -5], [10,2], {fixed: true});
        moveElement(validationText6, [-4.5, 4], 1000);
        moveElement(correctImage6, [-5, 3.5], 1000);
        if (!isCorrectExercise6) {
            respCorrect6 += 1;
            isCorrectExercise6 = true;
        }
    } else {
        validationText6 = createValidationText(board6, validationText6, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
        moveElement(validationText6, [-4.5, 4], 1000);
        board6.removeObject(correctImage6);
        respIncorrect6 += 1;
        isCorrectExercise4 = false;
    }
    console.log({isCorrectExercise4, respCorrect6, respIncorrect6, validation6, reset6});

}]);

 //BOTÓN BORRAR 
const buttonReset6 = createElement(board6, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
    clearBoard(board6, [...points6, ...inputs6, validationText6, correctImage6]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
    points6 = [];                                                                   
    inputs6 = [];
    validationText6 = null;
    correctImage6 = null;
    reset6 += 1
    // defaultpoints6.forEach((element, index) => {
    //     const pointsdefault5 = createPoint(board6, element, {fixed: true, name: ''});
    //     const defaultinput1 = createElement(board6, 'input', [-0.5, -0.4,`(${defaultinputText1[index][0]}, ${defaultinputText1[index][1]})`  ,""], {fixed: true, fontSize: 9.8,  cssStyle: "width: 45px", anchor: pointsdefault5 });
    //     points6.push(pointsdefault5);
    //     inputs6.push(defaultinput1);
    // });
    console.log(points6, inputs6, validationText6, correctImage6);
    console.log({isCorrectExercise6, respCorrect6, respIncorrect6, validation6, reset6});
}]);

// ---------------- Boton Enviar 

const btnSend = document.querySelector("#btnSend");


function sendData() {
    const data = [
        {
            reset: reset1,
            validation: validation1,
            respCorrect: respCorrect1,
            respIncorrect: respIncorrect1,
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
        },
        {
            reset: reset4,
            validation: validation4,
            respCorrect: respCorrect4,
            respIncorrect: respIncorrect4,
        },
        {
            reset: reset5,
            validation: validation5,
            respCorrect: respCorrect5,
            respIncorrect: respIncorrect5,
        },
        {
            reset: reset6,
            validation: validation6,
            respCorrect: respCorrect6,
            respIncorrect: respIncorrect6,
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

btnSend.addEventListener("click", () => sendData());    


