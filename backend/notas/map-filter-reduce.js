// Array de strings:
const alumnos = [
  'juan',
  'Javier',
  'Jose',
  'pedro',
  'maria',
  'jose',
  'ana',
  'diana',
  'lucia',
  'maria',
]

console.log(alumnos.length)
console.log(alumnos.slice(0, 1))
console.log(alumnos[0])

// metodos inmutable (no modifican el array) y métodos mutable (modifica el array)
// slice->>> inmutable  splice->>> mutable

// map | filter | reduce

// Array de objetos:
const alumnosDatos = [
  { nombre: 'juan', edad: 20, profesion: 'estudiante' },
  { nombre: 'Javier', edad: 21, profesion: 'estudiante' },
  { nombre: 'Jose', edad: 22, profesion: 'estudiante' },
  { nombre: 'pedro', edad: 23, profesion: 'estudiante' },
]
alumnosDatos.forEach((alumno) => {
  console.log(alumno)
})

// .map --> devuelve un nuevo array
// cuando la función solo tiene una linea se puede omitir las llaves usando la función flecha =>

// const alumnosEdad = alumnos.map(
//     function (alumno) {
//         return alumno.edad;
//     }
// )
// con funcion flecha

// const alumnosEdad = alumnos.map((alumno) => alumno.edad);

// .filter --> devuelve un nuevo array con los elementos que cumplen la condicion

const alumnosEstudiante = alumnos.filter(
  (alumno) => alumno.profesion === 'estudiante',
)
console.log(alumnosEstudiante)

// primero .filter y luego .map

const alumnosEstudianteEdad = alumnos
  .filter((alumno) => alumno.profesion === 'estudiante')
  .map((alumno) => alumno.edad)
console.log(alumnosEstudianteEdad)
console.log(alumnos)

// .reduce --> devuelve un solo valor
const totalEdad = alumnos.reduce(
  (acumulador, alumno) => acumulador + alumno.edad,
  0,
)
console.log(totalEdad)

// Array de objetos:
const cuentasBancarias = [
  {
    titular: 'Mali',
    saldoInicial: 200,
    movimientos: [100, -20, -10, 50],
    direccion: 'Av. Siempre Viva 742',
    telefono: '555-1234',
  },
  {
    titular: 'Gera',
    saldoInicial: 290,
    movimientos: [500, 1000, -400, -100],
    direccion: 'Calle Falsa 123',
    telefono: '555-5678',
  },
  {
    titular: 'Maui',
    saldoInicial: 67,
    movimientos: [10, -20, -30, -10],
    direccion: 'Av. Libertad 456',
    telefono: '555-9012',
  },
]

const saldoTotal = cuentasBancarias.reduce(
  (acumulador, cuenta) => acumulador + cuenta.saldoInicial,
  0,
)
console.log(saldoTotal)

const saldoFinal = cuentasBancarias.map((cuenta) => {
  return {
    titular: cuenta.titular,
    saldoFinal:
      cuenta.saldoInicial +
      cuenta.movimientos.reduce(
        (acumulador, movimiento) => acumulador + movimiento,
        0,
      ),
  }
})
console.log(saldoFinal)

const cuentasCompletas = cuentasBancarias.map((cuenta) => {
  return {
    ...cuenta,
    saldoFinal:
      cuenta.saldoInicial +
      cuenta.movimientos.reduce(
        (acumulador, movimiento) => acumulador + movimiento,
        0,
      ),
  }
})
console.log(cuentasCompletas)

// usar .filter y map para sacar nombres titulares cuyo saldo inicial sea mayor a 100
const cuentasBancariasFiltradas = cuentasBancarias
  .filter((cuenta) => cuenta.saldoInicial > 100)
  .map((cuenta) => cuenta.titular)
console.log(cuentasBancariasFiltradas)

console.log(cuentasBancarias)

const edades = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

// sumar las edades con .reduce

const totalEdades = edades.reduce((acumulador, edad) => acumulador + edad, 0)
console.log(totalEdades)

// sumar edades usando for

let totalEdadesFor = 0
for (let i = 0; i < edades.length; i++) {
  totalEdadesFor += edades[i]
}
console.log(totalEdadesFor)
