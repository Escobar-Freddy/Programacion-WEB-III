import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Reportes({ user, onLogout }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState({ productos: false, categorias: false });
  const [error, setError] = useState('');
  const [pdfGenerating, setPdfGenerating] = useState({ productos: false, categorias: false });
  const [pdfError, setPdfError] = useState({ productos: false, categorias: false });
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchProductos();
    fetchCategorias();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Cargar datos
  const fetchProductos = async () => {
      const response = await axios.get('http://localhost:5000/muestraProductos');
        setProductos(response.data);
        setLoading(prev => ({ ...prev, productos: false }));
  };

  const fetchCategorias = async () => {
      const response = await axios.get('http://localhost:5000/muestraCategoria');
        setCategorias(response.data);
        setLoading(prev => ({ ...prev, categorias: false }));
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return `Bs. ${isNaN(num) ? '0.00' : num.toFixed(2)}`;
  };

  // Función para obtener estado del stock
  const getStockStatus = (stock, stockMinimo) => {
    if (stock === 0) return { text: 'AGOTADO', color: '#dc3545' };
    if (stock <= stockMinimo) return { text: 'BAJO STOCK', color: '#ffc107' };
    return { text: 'EN STOCK', color: '#28a745' };
  };

  // GENERAR PDF USANDO jsPDF
  const generarPDFProductos = async () => {
    try {
      setPdfGenerating(prev => ({ ...prev, productos: true }));
      setPdfError(prev => ({ ...prev, productos: false }));
      
      // Importar jsPDF dinámicamente
      const { jsPDF } = await import('jspdf');
      const autoTable = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE PRODUCTOS', pageWidth / 2, 20, { align: 'center' });
      
      // Subtítulo
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Inventario', pageWidth / 2, 28, { align: 'center' });
      
      // Información
      doc.setFontSize(9);
      doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy')}`, 15, 38);
      doc.text(`Hora: ${format(new Date(), 'HH:mm')}`, pageWidth - 15, 38, { align: 'right' });
      doc.text(`Usuario: ${user?.nombre || 'Sistema'}`, 15, 44);
      doc.text(`Total productos: ${productos.length}`, pageWidth - 15, 44, { align: 'right' });
      
      // Resumen
      const totalValor = productos.reduce((sum, prod) => sum + (prod.stock * (prod.precio_costo || 0)), 0);
      const productosEnStock = productos.filter(p => p.stock > (p.stock_minimo || 0)).length;
      const productosBajoStock = productos.filter(p => p.stock > 0 && p.stock <= (p.stock_minimo || 0)).length;
      const productosAgotados = productos.filter(p => p.stock === 0).length;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMEN DEL INVENTARIO', 15, 58);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Productos: ${productos.length}`, 20, 66);
      doc.text(`En Stock: ${productosEnStock}`, 20, 72);
      doc.text(`Bajo Stock: ${productosBajoStock}`, 90, 66);
      doc.text(`Agotados: ${productosAgotados}`, 90, 72);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Valor total del inventario: ${formatCurrency(totalValor)}`, 20, 80);
      
      // Tabla de productos
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALLE DE PRODUCTOS', 15, 95);
      
      const tableData = productos.map((prod, index) => [
        index + 1,
        prod.nombre || '',
        prod.codigo_referencia || 'N/A',
        prod.categoria || 'General',
        `${prod.stock} ${prod.unidad_medida || 'und'}`,
        formatCurrency(prod.precio_venta),
        getStockStatus(prod.stock, prod.stock_minimo).text
      ]);
      
      autoTable.default(doc, {
        startY: 100,
        head: [['#', 'PRODUCTO', 'CÓDIGO', 'CATEGORÍA', 'STOCK', 'PRECIO VENTA', 'ESTADO']],
        body: tableData,
        headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 }
        },
        margin: { left: 15, right: 15 },
        styles: { overflow: 'linebreak' },
        didDrawPage: function (data) {
          // Pie de página
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(
            `Página ${doc.internal.getNumberOfPages()} • Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });
      
      // Guardar PDF - CORREGIDO
      doc.save(`productos-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
      
    } catch (error) {
      console.error('Error generando PDF de productos:', error);
      if (isMounted.current) {
        setPdfError(prev => ({ ...prev, productos: true }));
        setError('Error al generar el PDF. Por favor, intenta nuevamente.');
      }
    } finally {
      if (isMounted.current) {
        setPdfGenerating(prev => ({ ...prev, productos: false }));
      }
    }
  };

  const generarPDFCategorias = async () => {
    try {
      setPdfGenerating(prev => ({ ...prev, categorias: true }));
      setPdfError(prev => ({ ...prev, categorias: false }));
      
      // Importar jsPDF dinámicamente
      const { jsPDF } = await import('jspdf');
      const autoTable = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE CATEGORÍAS', pageWidth / 2, 20, { align: 'center' });
      
      // Subtítulo
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Inventario', pageWidth / 2, 28, { align: 'center' });
      
      // Información
      doc.setFontSize(9);
      doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy')}`, 15, 38);
      doc.text(`Hora: ${format(new Date(), 'HH:mm')}`, pageWidth - 15, 38, { align: 'right' });
      doc.text(`Usuario: ${user?.nombre || 'Sistema'}`, 15, 44);
      doc.text(`Total categorías: ${categorias.length}`, pageWidth - 15, 44, { align: 'right' });
      
      // Tabla de categorías
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('LISTADO DE CATEGORÍAS', 15, 58);
      
      const tableData = categorias.map((cat, index) => [
        index + 1,
        cat.nombre || '',
        cat.descripcion || 'Sin descripción',
        cat.created_at ? format(new Date(cat.created_at), 'dd/MM/yyyy') : 'N/A'
      ]);
      
      autoTable.default(doc, {
        startY: 64,
        head: [['#', 'NOMBRE', 'DESCRIPCIÓN', 'FECHA CREACIÓN']],
        body: tableData,
        headStyles: { fillColor: [39, 174, 96], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 100 },
          3: { cellWidth: 25 }
        },
        margin: { left: 15, right: 15 },
        styles: { overflow: 'linebreak' },
        didDrawPage: function (data) {
          // Pie de página
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(
            `Página ${doc.internal.getNumberOfPages()} • Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });
      
      // Resumen
      const finalY = doc.lastAutoTable.finalY || 100;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMEN', 15, finalY + 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de categorías registradas: ${categorias.length}`, 20, finalY + 25);
      
      // Guardar PDF - CORREGIDO
      doc.save(`categorias-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
      
    } catch (error) {
      console.error('Error generando PDF de categorías:', error);
      if (isMounted.current) {
        setPdfError(prev => ({ ...prev, categorias: true }));
        setError('Error al generar el PDF. Por favor, intenta nuevamente.');
      }
    } finally {
      if (isMounted.current) {
        setPdfGenerating(prev => ({ ...prev, categorias: false }));
      }
    }
  };

  // Función para limpiar errores - CORREGIDO
  const limpiarErrores = () => {
    setError('');
    setPdfError({ productos: false, categorias: false });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        
        <div className="page-content">
          <div className="page-header">
            <h1>📊 Reportes</h1>
            <button 
              className="btn-secondary"
              onClick={() => {
                limpiarErrores();
                fetchProductos();
                fetchCategorias();
              }}
              disabled={loading.productos || loading.categorias}
            >
              {loading.productos || loading.categorias ? '🔄 Actualizando...' : '🔄 Actualizar'}
            </button>
          </div>

          {/* Mostrar errores */}
          {(error || pdfError.productos || pdfError.categorias) && (
            <div className="message error" style={{ marginBottom: '1rem' }}>
              ⚠️ {error || 'Error al generar PDF'}
              <button 
                onClick={limpiarErrores}
                style={{ 
                  marginLeft: '1rem', 
                  background: 'none', 
                  border: 'none', 
                  color: '#666', 
                  cursor: 'pointer',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  backgroundColor: '#f5c6cb'
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Tarjetas de Estadísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#3498db20', color: '#3498db' }}>📦</div>
              <div className="stat-info">
                <h3>Productos</h3>
                <p>{loading.productos ? 'Cargando...' : productos.length} registros</p>
                {!loading.productos && productos.length > 0 && (
                  <small style={{ color: '#666' }}>
                    {productos.filter(p => p.stock === 0).length} agotados
                  </small>
                )}
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#27ae6020', color: '#27ae60' }}>📑</div>
              <div className="stat-info">
                <h3>Categorías</h3>
                <p>{loading.categorias ? 'Cargando...' : categorias.length} registros</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#9b59b620', color: '#9b59b6' }}>💰</div>
              <div className="stat-info">
                <h3>Valor Total</h3>
                <p>
                  {loading.productos ? 'Calculando...' : 
                    formatCurrency(productos.reduce((sum, prod) => sum + (prod.stock * (prod.precio_costo || 0)), 0))
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Generación de Reportes */}
          <div className="form-container" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              Generar Reportes PDF
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem'
            }}>
              {/* Reporte de Productos */}
              <div className="stat-card" style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #e9ecef',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    backgroundColor: '#3498db', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '1.5em', color: 'white' }}>📦</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Productos</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '0.9em' }}>
                      Reporte completo del inventario
                    </p>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95em' }}>
                Listado completo de productos con stock, precios y estado.
              </p>
              
              <div>
                {loading.productos ? (
                  <button className="btn-primary" disabled style={{ width: '100%' }}>
                    <span style={{ marginRight: '8px' }}>⏳</span>
                    Cargando datos...
                  </button>
                ) : 
                
                // ========== CON PERMISOS ==========
                // Solo admin y usuarios pueden descargar
                (user?.rol === 'admin' || user?.rol === 'usuario') ? (
                  productos.length > 0 ? (
                    <button
                      className="btn-success"
                      onClick={generarPDFProductos}
                      disabled={pdfGenerating.productos}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {pdfGenerating.productos ? (
                        <>
                          <span>⏳</span>
                          Generando PDF...
                        </>
                      ) : (
                        <>
                          <span>📥</span>
                          Descargar PDF
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="btn-secondary" disabled style={{ width: '100%' }}>
                      ⚠️ No hay datos
                    </button>
                  )
                ) : (
                  // Si no tiene permisos
                  <button className="btn-secondary" disabled style={{ width: '100%' }}>
                    🔒 No autorizado
                  </button>
                )}
              </div>
              </div>
              </div>

              {/* Reporte de Categorías */}
              <div className="stat-card" style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #e9ecef',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    backgroundColor: '#27ae60', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '1.5em', color: 'white' }}>📑</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Categorías</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '0.9em' }}>
                      Listado de categorías
                    </p>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95em' }}>
                    Todas las categorías registradas con descripciones.
                  </p>
                  
                  <div>
                    {loading.categorias ? (
                      <button className="btn-primary" disabled style={{ width: '100%' }}>
                        <span style={{ marginRight: '8px' }}>⏳</span>
                        Cargando datos...
                      </button>
                    ) : categorias.length > 0 ? (
                      <button 
                        className="btn-success" 
                        onClick={generarPDFCategorias}
                        disabled={pdfGenerating.categorias}
                        style={{ 
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {pdfGenerating.categorias ? (
                          <>
                            <span>⏳</span>
                            Generando PDF...
                          </>
                        ) : (
                          <>
                            <span>📥</span>
                            Descargar PDF
                          </>
                        )}
                      </button>
                    ) : (
                      <button className="btn-secondary" disabled style={{ width: '100%' }}>
                        ⚠️ No hay datos
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              fontSize: '0.9em',
              color: '#666'
            }}>
              <p style={{ margin: 0 }}>
                💡 Los reportes se generan en formato PDF listos para imprimir o compartir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;