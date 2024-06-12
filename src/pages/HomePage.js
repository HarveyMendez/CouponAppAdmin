import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose}) => {
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const form = event.target;
      const formData = new FormData(form);
      const data = {};
  
      formData.forEach((value, key) => {
        data[key] = value;
      });
  
      console.log(data);
   
      try {
        const response = await fetch('https://couponapi2.azurewebsites.net/index.php/insertEmpresa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error('Error al agregar el cupón');
        }
      } catch (error) {
        console.error('Error al enviar la solicitud POST:', error);
      }
      
    };
  
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Formulario para Añadir Empresa</h2>
          <button onClick={onClose} className="modal-close-button">Cerrar</button>
          
          <form id="cuponForm" onSubmit={handleSubmit}>
            <label htmlFor="nombre_empresa">Nombre Empresa:</label>
            <input type="text" id="nombre_empresa" name="nombre_empresa" required/><br/>

            <label htmlFor="nombre_usuario">Usuario:</label>
            <input type="text" id="nombre_usuario" name="nombre_usuario" required/><br/>

            <label htmlFor="direccion_fisica">Direccion Fisica:</label>
            <input type="text" id="direccion_fisica" name="direccion_fisica" required/><br/>

            <label htmlFor="cedula">Cedula:</label>
            <input type="number" id="cedula" name="cedula" required/><br/>

            <label htmlFor="correo_electronico">Correo Electronico:</label>
            <input type="email" id="correo_electronico" name="correo_electronico" required/><br/>

            <label htmlFor="ubicacion">Ubicacion:</label>
            <input type="text" id="ubicacion" name="ubicacion" required/><br/>

            <label htmlFor="telefono">Telefono:</label>
            <input type="number" id="telefono" name="telefono" required/><br/>
  
            <button type="submit">Añadir Empresa</button>
          </form>
        </div>
      </div>
    );
  };

const Modal2 = ({ isOpen, onClose, empresa }) => {
    
    const [cupones, setCupones] = useState([]);

    const fetchCupones = async () => {
        try {
          const response = await fetch(`https://couponapi2.azurewebsites.net/index.php/getCoupon?usuarioEmpresa=${empresa.nombre_usuario}`);
          const data = await response.json();
          setCupones(data);
        } catch (error) {
          console.error('Error al obtener los cupones:', error);
        }
      };

    const handleEstado = async (nombreCupon) => {

        const data = {};
        data['nombre_usuario']= empresa.nombre_usuario;
        data['nombre'] = nombreCupon;

        try {
            const response = await fetch('https://couponapi2.azurewebsites.net/index.php/changeStatusCupon', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
      
            if (!response.ok) {
              console.log("hubo errores");
            }
          } catch (error) {
            console.error('Error al enviar la solicitud PUT:', error);
          }

          fetchCupones();
      };

      useEffect(() => {
        
          fetchCupones();
        
      }, [empresa]);
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
        <button onClick={onClose} className="modal-close-button">Cerrar</button>
        <table>
        <thead>
          <tr>
            <th>Nombre del Cupón</th>
            <th>Estado</th>
            <th>Acciones</th>
            
          </tr>
        </thead>
        <tbody>
          {cupones.map(cupon => (
            <tr key={cupon.id}>
              <td>{cupon.nombre}</td>
              
              <td>{cupon.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => handleEstado(cupon.nombre)}>Cambiar estado</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
    );
  };

const HomePage = () => {
    const [empresas, setEmpresas] = useState([]);
  
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

    const [loading, setLoading] = useState(true);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const openSecondModal = () => {
      setIsSecondModalOpen(true);
    };
  
    const closeSecondModal = () => {
      setIsSecondModalOpen(false);
    };
  
    const handleVerCupones = (empresaId) => {
        const empresa = empresas.find(empresa => empresa.id === empresaId);
        setEmpresaSeleccionada(empresa);
        openSecondModal();
    };

    const handleCambiarEstado = async (empresaId) => {

        const empresa = empresas.find(empresa => empresa.id === empresaId);
        const data = {};
        data['nombre_usuario']= empresa.nombre_usuario;

        try {
            const response = await fetch('https://couponapi2.azurewebsites.net/index.php/changeStatusBusiness', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
      
            if (!response.ok) {
              console.log("hubo errores");
            }
          } catch (error) {
            console.error('Error al enviar la solicitud PUT:', error);
          }
        fetchBusiness();
    };
  
  
    const fetchBusiness = async () => {
        setEmpresas([]);
      try {
        const response = await fetch(`https://couponapi2.azurewebsites.net/index.php/getBusiness`);
        const data = await response.json();
        setEmpresas(data);
        setLoading(false); 
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };
  
    useEffect(() => {
        fetchBusiness();
    }, []);
  
    return (
      <div>
        <h1>Usuario: Admin</h1>
        <h2>Listado de Empresas</h2>
        <button onClick={openModal}>Agregar Nueva Empresa</button>
        <button onClick={fetchBusiness}>Actualizar tabla</button>
        <Modal isOpen={isModalOpen} onClose={closeModal} />
        {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table>
          <thead>
            <tr>
              <th>Nombre de la empresa</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
              
            </tr>
          </thead>
          <tbody>
            {empresas.map(empresa => (
              <tr key={empresa.id}>
                <td>{empresa.nombre_empresa}</td>
                <td>{empresa.nombre_usuario}</td>
                <td>{empresa.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <button onClick={() => handleCambiarEstado(empresa.id)}>Cambiar estado</button>
                  <button onClick={() => handleVerCupones(empresa.id)}>Ver Cupones</button>
                  <button>Generar Token</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
        
        <Modal2 isOpen={isSecondModalOpen} onClose={closeSecondModal} empresa={empresaSeleccionada} />
      </div>
    );
  };
  
  export default HomePage;