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
  },
  pan = {
    needTwoFingers: true,
    enabled: true,
    needShift: true
  },
  zoom = {
    needShift: true
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
      keyboard,
      pan,
      zoom
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
      // listToAddPoints.forEach((element) => {
      //   // console.log('element: ', element.childElements);
      //   Object.keys(element.childElements).forEach((key) => {
      //     if (key === 'undefined') {
      //       const inputElement = element.childElements[key];
      //       inputElement.visProp.cssstyle += ';display: none';
      //     }
      //   })
      // })
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
  // } else {
  //   // console.log('Aqui');
  //   // listToAddPoints.forEach((element) => {
  //   //   console.log('element: ', element.childElements);
  //   //   Object.keys(element.childElements).forEach((key) => {
  //   //     if (key === 'undefined') {
  //   //       const inputElement = element.childElements[key];
  //   //       inputElement.visProp.cssstyle += ';display: none';
  //   //     }
  //   //   })
  //   // })
  //   Object.keys(elementsUnderMouse[0].childElements).forEach((key) => {
  //     if (key === 'undefined') {
  //       console.log(elementsUnderMouse[0].childElements[key].id);
  //       input = elementsUnderMouse[0].childElements[key];
  //       input.visProp.cssstyle = `${input.visProp.cssstyle}`.replace(';display: none', '');
  //       console.log(input.visProp.cssstyle);
  //     }
  //   })
  // }
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
// FUNCIÓN PARA CREAR PUNTOS POR DEFECTO EN BASE A LAS CONFIGURACIONES
function createPointsByConfig(board, config, inputSpace, options = {}) {
  config.forEach(element => {
    const point = createPoint(board, element.coord, {...options, ...element.options, visible: element.isVisible });

    if (element.hasInput) {
      const input = createElement(board, 'input', [inputSpace[0], inputSpace[1], element.inputLabel,""],  {fixed: true, cssStyle: "width: 48px", disabled: element.isDisabled, fontSize: 9.8, anchor: point });
    }
  });
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

//----------------- EJERCICIO 1 -----------------------
let points1 = []
let inputs1 = []
let validationText1 = null
let correctImage1 = null
let reset1 = 0
let validation1 = 0
let respCorrect1 = 0
let respIncorrect1 = 0
let isCorrectExercise1 = false;
let pointConfigs1 = [
  { value: ['x', '-y'], coord: [0.5, -2.5], hasInput: false, isVisible: false, isValidable: true },
  { value: ['-x','y'], coord: [-0.5, 2.5], hasInput: false, isVisible: false, isValidable: true },
  { value: ['-x','-y'], coord: [-0.5, -2.5], hasInput: false, isVisible: false, isValidable: true },
  { value: ['y','x'], coord: [2.5, 0.5], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','y'], coord: [0.5, 2.5], hasInput: true, isVisible: true, isValidable: false, inputLabel: '(x, y)', isDisabled: false }
]

const board1 = createBoard('box1', {boundingbox : [-4, 4, 4, -4], grid : { visible: true} });

createPointsByConfig(board1, pointConfigs1, [-0.5, -0.4], { size: 1, fixed: true, name: '' })

board1.on("down", (e) =>  onClickBoard({ board: board1, event: e, listToAddPoints: points1, pointsHasInput: true, listToAddInputs: inputs1 }));

const buttonCheck1 = createElement(board1, 'button', [-3.5, -3.5, 'Verificar', () => {
  validation1 += 1
  const isValid = validateExercise(points1, inputs1, pointConfigs1, [0.1, 0.2]);
  if (isValid) {
    validationText1 = createValidationText(board1, validationText1, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
    correctImage1 = createCorrectImage (board1, correctImage1, "confetti5.png", [5, -5], [8,2], {fixed: true});
    moveElement(validationText1, [-3.5, 2.5], 1000);
    moveElement(correctImage1, [-4, 2.7], 1000);
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
const buttonReset1 = createElement(board1, "button", [-1, -3.5, "Borrar", () => {  //Se crea el boton de Borrar
  clearBoard(board1, [...points1, ...inputs1, validationText1, correctImage1]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
  points1 = [];                                                                   
  inputs1 = [];
  validationText1 = null;
  correctImage1 = null;
  reset1 += 1

  console.log(points1, inputs1, validationText1, correctImage1);
    console.log({isCorrectExercise1, respCorrect1, respIncorrect1, validation1, reset1});
}]);

//----------------- EJERCICIO 2 -----------------------

let points2 = []
let inputs2 = []
let validationText2 = null
let correctImage2 = null
let reset2 = 0
let validation2 = 0
let respCorrect2 = 0
let respIncorrect2 = 0
let isCorrectExercise2 = false;
let pointConfigs2 = [
  { value: ['b','0'], coord: [-1, 0], hasInput: false, isVisible: false, isValidable: true },
  { value: ['b','b'], coord: [-1, -1], hasInput: false, isVisible: false, isValidable: true },
   { value: ['a','-a'], coord: [2, -2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['-a','-b'], coord: [2, 1], hasInput: false, isVisible: false, isValidable: true },
  { value: ['a','-a'], coord: [-2, 2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['-b','-b'], coord: [1, 1], hasInput: false, isVisible: false, isValidable: true },
  { value: ['a','0'], coord: [2, 0], hasInput: true, isVisible: true, isValidable: false, inputLabel: '(a, 0)' },
  { value: ['0','b'], coord: [0, -1], hasInput: true, isVisible: true, isValidable: false, inputLabel: '(0, b)' }
]

const board2 = createBoard('box2', {boundingbox : [-4, 4, 4, -4], grid : { visible: true} });

createPointsByConfig(board2, pointConfigs2, [-0.5, -0.4], { size: 1, fixed: true, name: '' })

board2.on("down", (e) =>  onClickBoard({ board: board2, event: e, listToAddPoints: points2, pointsHasInput: true, listToAddInputs: inputs2 }));

const buttonCheck2 = createElement(board2, 'button', [-3.5, -3.5, 'Verificar', () => {
  validation2 += 1
  const isValid = validateExercise(points2, inputs2, pointConfigs2, [0.1, 0.2]);
  if (isValid) {
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

  console.log(points2, inputs2, validationText2, correctImage2);
  console.log({isCorrectExercise2, respCorrect2, respIncorrect2, validation2, reset2});
}]);

//----------------- EJERCICIO 3 -----------------------

let points3 = []
let inputs3 = []
let validationText3 = null
let correctImage3 = null
let reset3 = 0
let validation3 = 0
let respCorrect3 = 0
let respIncorrect3 = 0
let isCorrectExercise3 = false;
let pointConfigs3 = [
  { value: ['x-2','y'], coord: [-0.8, 2.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x+2','y'], coord: [3.2, 2.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','y-2'], coord: [1.2, 0.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','y+2'], coord: [1.2, 4.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x-2','y-2'], coord: [-0.8, 0.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x+2','y+2'], coord: [3.2, 4.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','y'], coord: [1.2, 2.2], hasInput: true, isVisible: true, isValidable: false, inputLabel: '(x, y)' }, 
]

const board3 = createBoard('box3', {boundingbox : [-5, 5, 5, -5], grid : { visible: true} });

createPointsByConfig(board3, pointConfigs3, [-0.5, -0.4], { size: 1, fixed: true, name: '' })

board3.on("down", (e) =>  onClickBoard({ board: board3, event: e, listToAddPoints: points3, pointsHasInput: true, listToAddInputs: inputs3 }));

const buttonCheck3 = createElement(board3, 'button', [-3.5, -4.2, 'Verificar', () => {
  validation3 += 1
  const isValid = validateExercise(points3, inputs3, pointConfigs3, [0.1, 0.2]);
  if (isValid) {
    validationText3 = createValidationText(board3, validationText3, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
    correctImage3 = createCorrectImage (board3, correctImage3, "confetti5.png", [5, -5], [10,2], {fixed: true});
    moveElement(validationText3, [-4.5, 3.5], 1000);
    moveElement(correctImage3, [-5, 3.5], 1000);
    if (!isCorrectExercise3) {
        respCorrect3 += 1;
        isCorrectExercise3 = true;
    }
} else {
    validationText3 = createValidationText(board3, validationText3, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 19, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
    moveElement(validationText3, [-4.8, 3], 1000);
    board3.removeObject(correctImage3);
    respIncorrect3 += 1;
    isCorrectExercise3 = false;
}
  console.log({isCorrectExercise3, respCorrect3, respIncorrect3, validation3, reset3});
}]);

 //BOTÓN BORRAR 
 const buttonReset3 = createElement(board3, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
  clearBoard(board3, [...points3, ...inputs3, validationText3, correctImage3]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
  points3 =[];
  inputs3 = [];
  validationText3 = null;
  correctImage3 = null;
  reset3 += 1

  console.log(points3, inputs3, validationText3, correctImage3);
  console.log({isCorrectExercise3, respCorrect3, respIncorrect3, validation3, reset3});
}]);

//----------------- EJERCICIO 4 -----------------------

let points4 = []
let inputs4 = []
let validationText4 = null
let correctImage4 = null
let reset4 = 0
let validation4 = 0
let respCorrect4 = 0
let respIncorrect4 = 0
let isCorrectExercise4 = false;
let pointConfigs4 = [
  { value: ['2x','y'], coord: [4.4 , 0.8], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','2y'], coord:  [2.2, 1.6], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x/2','y'], coord: [1.1, 0.8], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','y/2'], coord: [2.2, 0.4], hasInput: false, isVisible: false, isValidable: true },
  { value: ['2x','-y'], coord: [4.4, -0.8], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x/2','y/2'], coord: [1.1, 0.4], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','y'], coord: [2.2, 0.8], hasInput: true, isVisible: true, isValidable: false, inputLabel: '(x, y)' },
]

const board4 = createBoard('box4', {boundingbox : [-5, 5, 5, -5], grid : { visible: true} });

createPointsByConfig(board4, pointConfigs4, [-0.5, -0.4], { size: 1, fixed: true, name: '' })

board4.on("down", (e) =>  onClickBoard({ board: board4, event: e, listToAddPoints: points4, pointsHasInput: true, listToAddInputs: inputs4 }));

const buttonCheck4 = createElement(board4, 'button', [-3.5, -4.2, 'Verificar', () => {
  const isValid = validateExercise(points4, inputs4, pointConfigs4, [0.1, 0.2]);
  validation4 += 1
  if (isValid) {
    validationText4 = createValidationText(board4, validationText4, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
    correctImage4 = createCorrectImage (board4, correctImage4, "confetti5.png", [5, -5], [8,2], {fixed: true});
    moveElement(validationText4, [-4.5, 3.5], 1000);
    moveElement(correctImage4, [-5, 3.5], 1000);
    if (!isCorrectExercise4) {
        respCorrect4 += 1;
        isCorrectExercise4 = true;
    }
} else {
    validationText4 = createValidationText(board4, validationText4, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
    moveElement(validationText4, [-4.8, 4], 1000);
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

  console.log(points4, inputs4, validationText4, correctImage4);
  console.log({isCorrectExercise4, respCorrect4, respIncorrect4, validation4, reset4});
}]);

//----------------- EJERCICIO 5-----------------------

let inputs5 = []
let points5 = []
let validationText5 = null
let correctImage5 = null
let reset5 = 0
let validation5 = 0
let respCorrect5 = 0
let respIncorrect5 = 0
let isCorrectExercise5 = false;
let pointConfigs5 = [
  { value: ['y','0'], coord: [0.8 , 0] , hasInput: false, isVisible: false, isValidable: true },
  { value: ['0','x'], coord:  [0, 2.2], hasInput: false, isVisible: false, isValidable: true },


  { value: ['x','0'], coord: [2.2, 0], hasInput: false, isVisible: false, isValidable: true },
  { value: ['0','y'], coord: [0, 0.8], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x','x'], coord: [2.2, 2.2] , hasInput: false, isVisible: false, isValidable: true },
  { value: ['y','y'], coord: [0.8, 0.8],  hasInput: false, isVisible: false, isValidable: true } , 

  { value: ['x','y'], coord: [2.2, 0.8] , hasInput: true, isVisible: true, isValidable: false, inputLabel: '(x, y)' },
]

const board5 = createBoard('box5', {boundingbox : [-5, 5, 5, -5], grid : { visible: true} });

createPointsByConfig(board5, pointConfigs5, [-0.5, -0.4], { size: 1, fixed: true, name: '' })

board5.on("down", (e) =>  onClickBoard({ board: board5, event: e, listToAddPoints: points5, pointsHasInput: true, listToAddInputs: inputs5 }));

const buttonCheck5 = createElement(board5, 'button', [-3.5, -4.2, 'Verificar', () => {
  validation5 += 1
  const isValid = validateExercise(points5, inputs5, pointConfigs5, [0.1, 0.2]);
  if (isValid) {
    validationText5 = createValidationText(board5, validationText5, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
    correctImage5 = createCorrectImage (board5, correctImage5, "confetti5.png", [5, -5], [8,2], {fixed: true});
    moveElement(validationText5, [-4.5, 3.5], 1000);
    moveElement(correctImage5, [-5, 3.5], 1000);
    if (!isCorrectExercise5) {
        respCorrect5 += 1;
        isCorrectExercise5 = true;
    }
} else {
    validationText5 = createValidationText(board5, validationText5, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
    moveElement(validationText5, [-4.8, 4], 1000);
    board5.removeObject(correctImage5);
    respIncorrect5 += 1;
    isCorrectExercise5 = false;
}
  console.log({isCorrectExercise5, respCorrect5, respIncorrect5, validation5, reset5});
}]);


//BOTÓN BORRAR 
const buttonReset5 = createElement(board5, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
  clearBoard(board5, [...points5, ...inputs5, validationText5, correctImage5]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
  points5 = [];                                                                   
  inputs5 = [];
  validationText5 = null;
  correctImage5 = null;
  reset5 += 1

  console.log(points5, inputs5, validationText5, correctImage5);
  console.log({isCorrectExercise5, respCorrect5, respIncorrect5, validation5, reset5});
}]);

//----------------- EJERCICIO 6-----------------------
let inputs6 = []
let points6 = []
let validationText6 = null
let correctImage6 = null
let reset6 = 0
let validation6 = 0
let respCorrect6 = 0
let respIncorrect6 = 0
let isCorrectExercise6 = false;
let pointConfigs6 = [
  { value: ['x','x+2'], coord: [2.2 , 4.2], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x+y','y'], coord:  [3, 0.8], hasInput: false, isVisible: false, isValidable: true },

  { value: ['x','-y'], coord: [2.2, -0.8], hasInput: false, isVisible: false, isValidable: true },
  { value: ['x+2','2y'], coord: [4.2, 1.6], hasInput: false, isVisible: false, isValidable: true },
  { value: ['2x','2y'], coord: [4.4, 1.6], hasInput: false, isVisible: false, isValidable: true } ,


  { value: ['x','y'], coord: [ 2.2, 0.8], hasInput: true, isVisible: true, isValidable: false, inputLabel: '(x, y)'} 
]


const board6 = createBoard('box6', {boundingbox : [-5, 5, 5, -5], grid : { visible: true} });

createPointsByConfig(board6, pointConfigs6, [-0.5, -0.4], { size: 1, fixed: true, name: '' })

board6.on("down", (e) =>  onClickBoard({ board: board6, event: e, listToAddPoints: points6, pointsHasInput: true, listToAddInputs: inputs6 }));

const buttonCheck6 = createElement(board6, 'button', [-3.5, -4.2, 'Verificar', () => {
  validation6 += 1
  const isValid = validateExercise(points6, inputs6, pointConfigs6, [0.1, 0.2]);
  if (isValid) {
    validationText6 = createValidationText(board6, validationText6, "¡MUY BIEN!", [5, -5], {fixed: true, fontSize: 30, color: "green", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;"});
    correctImage6 = createCorrectImage (board6, correctImage6, "confetti5.png", [5, -5], [8,2], {fixed: true});
    moveElement(validationText6, [-4.5, 3.5], 1000);
    moveElement(correctImage6, [-5, 3.5], 1000);
    if (!isCorrectExercise6) {
        respCorrect6 += 1;
        isCorrectExercise6 = true;
    }
} else {
    validationText6 = createValidationText(board6, validationText6, "REVISA TUS RESPUESTAS", [5, -5], {fixed: true, fontSize: 20, color: "#000", cssClass: "fw-bold", cssStyle: "font-family: 'Noto Sans', Arial;background-color: #ff7979; padding: 0 5px;"});
    moveElement(validationText6, [-4.8, 3], 1000);
    board6.removeObject(correctImage6);
    respIncorrect6 += 1;
    isCorrectExercise6 = false;
}
  console.log({isCorrectExercise6, respCorrect6, respIncorrect6, validation6, reset6});
}]);

 //BOTÓN BORRAR 
 const buttonReset6 = createElement(board6, "button", [-1, -4.2, "Borrar", () => {  //Se crea el boton de Borrar
  clearBoard(board6, [...points6, ...inputs6, validationText6, correctImage6]);      //Se llama la funcion para borrar tableri , pasandole los parametros 
  points6 = [];                                                                   
  inputs6 = [];
  validationText6 = null;
  correctImage6 = null;
  reset6 += 1

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
