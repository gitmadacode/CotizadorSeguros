import React,{useState} from "react";
import styled from "@emotion/styled";
import PropTypes from 'prop-types';
import {obtenerDiferenciaYear,calcularMarca,obtenerPlan} from "../helpers";

const Campo = styled.div`
  display:flex;
  margin-bottom: 1rem;
  align-items: center;
`;
const Label = styled.label`
flex: 0 0 100px;
`;
const Select = styled.select`
  display: block;
  width:100%;
  padding:1rem;
  border: 1px solid #e1e1e1;
  -webkit-appearance: none;
`;
const InputRadio = styled.input`
margin: 0 1rem;
`;
const Boton = styled.button`
  background-color:#00838F;
  font-size:16px;
  width:100%;
  padding:1rem;
  color:#fff;
  text-transform: uppercase;
  font-weight:bold;
  border:none;
  transition: background-color .3s ease;
  margin-top: 2rem;

  &:hover {
    background-color: #26C6DA;
    cursor: pointer;
  }
`;

const Error = styled.div`
  background-color: red;
  color: white;
  padding: 1rem;
  width:100%;
  text-align:center;
  margin-bottom:2rem;
`;


const Formulario = ({guardarResumen,guardarCargando}) => {

  const [datos,guardarDatos] = useState({
    marca:'',
    year:'',
    plan:''
  });

  //Creamos un state para los errores
  const[error,guardarError] = useState(false);

  //Extraer los valores del state
  const {marca,year,plan} = datos;

  //Leer los datos del formulario y colocarlos en el state
  const obtenerInformacion = e => {
    guardarDatos({
      ...datos,
      [e.target.name] : e.target.value
    })
  }

  //Cuando el usuario presione submit
  const cotizarSeguro = e => {
    e.preventDefault();
    if(marca.trim() === '' || year.trim() === '' || plan.trim() === ''){
      guardarError(true);
      return;
    }
    guardarError(false);
    
    //Una base de 2000
    let resultado = 2000;

    //Obtener la diferencia de años
    const diferencia = obtenerDiferenciaYear(year);
    console.log(diferencia);

    //Por cada año restar un 3%
    resultado -= ((diferencia * 3 )* resultado) /100;
    

    //Americano 15%
    //Asiatico 5%
    //Europeo 30%
    resultado = calcularMarca(marca) * resultado;
    console.log(resultado);
    //Basico aumenta 20%
    //Completo 50%
    const incrementoPlan = obtenerPlan(plan);
    console.log(incrementoPlan);
    //toFixed es que queremos el resultado con solo 2 digitos
    resultado = parseFloat(incrementoPlan * resultado).toFixed(2); 
    //El spiner
    guardarCargando(true);

    setTimeout(() => {
      //Elimina el spiner
      guardarCargando(false);
      //Pasa la informacion al componente principal
      guardarResumen({
        cotizacion: Number(resultado),
        datos // los datos marca year y plan llenados
      });
    }, 3000);
    //Total, pasamos el resultado medianto props al state de app
   
  }


  return (
    <form
    onSubmit={cotizarSeguro}
    >
    {error ?<Error>Todos los campos son obligatorios!</Error> : null}
      <Campo>
        <Label>marca</Label>
        <Select
        name="marca"
        value={marca}
        onChange={obtenerInformacion}
        >
          <option value="">--Seleccione--</option>
          <option value="americano">Americano</option>
          <option value="europeo">Europeo</option>
          <option value="asiatico">Asiatico</option>
        </Select>
      </Campo>

      <Campo>
        <Label>Año</Label>
        <Select
        name="year"
        value={year}
        onChange={obtenerInformacion}
        id="selectElementId"
        >
          <option value="">-- Seleccione --</option>
          <option>2021</option>
          <option>2020</option>
          <option>2019</option>
          <option>2018</option>
          <option>2017</option>
          <option>2016</option>
          <option>2015</option>
          <option>2014</option>
          <option>2013</option>
          <option>2012</option>
        </Select>
      </Campo>
      <Campo>
        <Label>Plan</Label>
        <InputRadio
            type="radio"
            name="plan"
            value="basico"
            checked={plan === "basico"}
            onChange={obtenerInformacion}
        /> Basico 

        <InputRadio
        type="radio"
        name="plan"
        value="completo"
        checked={plan === "completo"}
        onChange={obtenerInformacion}
    /> Completo
      </Campo>

      <Boton type="submit">Cotizar</Boton>
    </form>
  );
}
Formulario.propTypes = {
  guardarResumen: PropTypes.func.isRequired,
  guardarCargando: PropTypes.func.isRequired
}

export default Formulario;
