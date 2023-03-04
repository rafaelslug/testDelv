import './App.css';


const keyUpHandler = async(event) => {
  const response = await fetch('https://gxicm35je9.execute-api.us-east-1.amazonaws.com/prod/cp', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cp: event.target.value,
    }),
  });
  console.log(response);
};


function App() {
  return (
    <div className="wrapper">
      <h1 className="title">Delivery</h1>
      <div className="form main-content">
        <div className="colum">
          <fieldset className="content-origin">
              <p>Remitente</p>
              <div className="content-input">
                <input name="rNombre" type="text" id="rNombre" placeholder="Nombre"/>
              </div>
              <div className="content-input">
                <input name="rCp" id="rCp" type="text" onKeyUp={keyUpHandler}  placeholder="Codigo postal"/>
              </div>
              <div className="content-input">
                <select name="rEstado" id="rEstado">
                    <option value="">Estado</option>
                    <option value="1">Aguascalientes</option>
                    <option value="2">Baja California</option>
                    <option value="3">Baja California Sur</option>
                </select>
              </div>
              <div className="content-input">
                <input name="rCiudad" id="rCiudad" type="text" placeholder="Ciudad"/>
              </div>
              <div className="content-input">
                <input name="rColonia" id="rColonia" type="text" placeholder="Colonia"/>
              </div>
              <div className="content-input">
                <input name="rCalle" id="rCalle" type="text" placeholder="Calle"/>
              </div>
              <div className="content-input">
                <input name="rNumero" id="rNumero" type="text" placeholder="Número"/>
              </div>
          </fieldset>
          {/* <button type="submit">Submit</button> */}
          
        </div>
        <div className="colum">
          < img src={"img/route_google_map.png"} alt="route" className="image"/>
        </div>
        <div className="colum">
          <fieldset className="content-destination">
              <p>Consignatario</p>
              <div className="content-input">
                <input name="rNombre" type="text" id="rNombre" placeholder="Nombre"/>
              </div>
              <div className="content-input">
                <input name="rCp" id="rCp" type="text" placeholder="Codigo postal"/>
              </div>
              <div className="content-input">
                <select name="rEstado" id="rEstado">
                    <option value="">Estado</option>
                    <option value="1">Aguascalientes</option>
                    <option value="2">Baja California</option>
                    <option value="3">Baja California Sur</option>
                </select>
              </div>
              <div className="content-input">
                <input name="rCiudad" id="rCiudad" type="text" placeholder="Ciudad"/>
              </div>
              <div className="content-input">
                <input name="rColonia" id="rColonia" type="text" placeholder="Colonia"/>
              </div>
              <div className="content-input">
                <input name="rCalle" id="rCalle" type="text" placeholder="Calle"/>
              </div>
              <div className="content-input">
                <input name="rNumero" id="rNumero" type="text" placeholder="Número"/>
              </div>
          </fieldset>
        </div>
      </div>
      <div className="content-submit-data">
        <input type="submit" value="Guardar" className="submit-data" />
      </div>
    </div>
  );
}

export default App;
