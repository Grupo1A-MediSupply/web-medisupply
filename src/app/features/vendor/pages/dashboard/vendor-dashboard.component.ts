import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as L from 'leaflet';
import * as Papa from 'papaparse';
import { OrderService } from '../../../../core/services/order.service';
import { ProductService } from '../../../../core/services/product.service';
import { LogisticsService } from '../../../../core/services/logistics.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html'
})
export class VendorDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  activeSection = 'orders';
  private map: L.Map | null = null;
  private routeLayers: L.LayerGroup[] = [];
  
  orders: any[] = [];
  isLoadingOrders = false;
  ordersError = '';

  inventory: any[] = [];
  isLoadingInventory = false;
  inventoryError = '';

  // Routes module properties
  showRouteGeneration = false;
  selectedOrder: any = null;
  selectedRoute: any = null;
  selectedVehicle: any = null;

  // Order creation properties
  showOrderCreation = false;
  orderForm: any = {
    clientName: '',
    clientAddress: '',
    deliveryDate: '',
    generateRoute: false,
    products: []
  };

  // Route generation within order creation
  showRouteGenerationInOrder = false;
  selectedRouteInOrder: any = null;
  selectedVehicleInOrder: any = null;

  // Order details and edit properties
  showOrderDetails = false;
  showOrderEdit = false;
  selectedOrderForDetails: any = null;
  selectedOrderForEdit: any = null;
  showDeleteConfirmation = false;
  orderToDelete: any = null;

  // Inventory details properties
  showInventoryDetails = false;
  selectedInventoryItem: any = null;

  // Reports data
  reportData = {
    ordersByStatus: {
      labels: ['Creadas', 'Programadas', 'En Tránsito', 'Completadas', 'Pendientes'],
      data: [0, 0, 0, 0, 0]
    },
    ordersByMonth: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      data: [12, 19, 8, 15, 22, 18]
    },
    returnsData: {
      labels: ['Producto Defectuoso', 'Pedido Incorrecto', 'Daño en Transporte', 'Cliente No Satisfecho'],
      data: [5, 3, 2, 1]
    },
    inventoryStatus: {
      labels: ['Stock Normal', 'Stock Bajo', 'Por Vencer', 'Vencido'],
      data: [0, 0, 0, 0]
    }
  };

  // Upload properties
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  uploadMessage = '';
  showUploadSuccess = false;

  // Required columns for CSV validation
  private readonly REQUIRED_COLUMNS = [
    'name', 'stock', 'price', 'expiry', 'lot', 'warehouse', 
    'supplier', 'category', 'description', 'batches'
  ];

  routeOrders: any[] = [];

  routes: any[] = [];
  isLoadingRoutes = false;
  routesError = '';

  suggestedRoutes: any[] = [];
  locations: any = {};
  availableVehicles: any[] = [];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private logisticsService: LogisticsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateReportData();
    
    // Set initial section based on current URL
    this.updateActiveSectionFromRoute(this.router.url);
    
    // Listen to route changes to update active section
    if (this.router.events) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateActiveSectionFromRoute(event.url);
        });
    }
    
    // Cargar datos del backend
    this.loadOrders();
    this.loadInventory();
    this.loadRoutes();
  }
  
  loadOrders() {
    this.isLoadingOrders = true;
    this.ordersError = '';
    
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.orders.map(order => ({
          id: order.orderNumber || order._id,
          product: order.products?.map((p: any) => `${p.productName} (${p.quantity})`).join(', ') || 'Sin productos',
          status: order.status,
          products: order.products,
          deliveryAddress: order.deliveryAddress,
          deliveryDate: order.deliveryDate,
          contactName: order.contactName,
          contactPhone: order.contactPhone,
          notes: order.notes,
          routeId: order.routeId,
          returnRequested: order.returnRequested,
          returnReason: order.returnReason,
          returnStatus: order.returnStatus
        }));
        this.isLoadingOrders = false;
        this.updateReportData();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.ordersError = 'Error al cargar pedidos';
        this.isLoadingOrders = false;
      }
    });
  }
  
  loadInventory() {
    this.isLoadingInventory = true;
    this.inventoryError = '';
    
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.inventory = response.products.map(product => ({
          name: product.name,
          stock: product.stock,
          price: product.price,
          expiry: product.expiry,
          lot: product.lot,
          warehouse: product.warehouse,
          supplier: product.supplier,
          category: product.category,
          description: product.description,
          batches: product.batches || []
        }));
        this.isLoadingInventory = false;
        this.updateReportData();
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.inventoryError = 'Error al cargar inventario';
        this.isLoadingInventory = false;
      }
    });
  }
  
  loadRoutes() {
    this.isLoadingRoutes = true;
    this.routesError = '';
    
    this.logisticsService.getRoutes().subscribe({
      next: (response) => {
        this.routes = response.routes.map(route => ({
          id: route.routeNumber || route._id,
          vehicle: route.vehicleType,
          driver: route.driverName,
          status: route.status,
          progress: route.progress,
          vehicleId: route.vehicleId,
          vehicleType: route.vehicleType,
          driverPhone: route.driverPhone,
          estimatedDistance: route.estimatedDistance,
          estimatedDuration: route.estimatedDuration,
          estimatedFuel: route.estimatedFuel,
          actualDistance: route.actualDistance,
          actualDuration: route.actualDuration,
          actualFuel: route.actualFuel,
          startTime: route.startTime,
          endTime: route.endTime,
          stops: route.stops
        }));
        
        // Actualizar routeOrders con información de rutas
        this.updateRouteOrders();
        this.isLoadingRoutes = false;
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.routesError = 'Error al cargar rutas';
        this.isLoadingRoutes = false;
      }
    });
  }
  
  updateRouteOrders() {
    // Obtener pedidos sin ruta para mostrar en la sección de rutas
    this.orderService.getOrders({ status: 'Creado' }).subscribe({
      next: (response) => {
        this.routeOrders = response.orders
          .filter(order => !order.routeId)
          .map(order => ({
            id: order.orderNumber || order._id,
            client: order.contactName || 'Cliente',
            address: order.deliveryAddress,
            date: order.deliveryDate,
            status: 'Sin Ruta',
            routeId: null
          }));
      },
      error: (error) => {
        console.error('Error loading route orders:', error);
      }
    });
  }

  ngAfterViewInit() {
    // El mapa se inicializará cuando se abra el modal
  }

  setActiveSection(section: string) {
    // Update activeSection immediately for tests and UI responsiveness
    this.activeSection = section;
    
    // Navigate to the corresponding route
    switch(section) {
      case 'orders':
        this.router.navigate(['/vendor/orders'], { replaceUrl: true });
        break;
      case 'upload':
        this.router.navigate(['/vendor/upload'], { replaceUrl: true });
        break;
      case 'inventory':
        this.router.navigate(['/vendor/inventory'], { replaceUrl: true });
        break;
      case 'routes':
        this.router.navigate(['/vendor/routes'], { replaceUrl: true });
        break;
      case 'reports':
        this.router.navigate(['/vendor/reports'], { replaceUrl: true });
        break;
      default:
        this.router.navigate(['/vendor'], { replaceUrl: true });
        break;
    }
  }

  updateActiveSectionFromRoute(url: string) {
    if (!url) {
      this.activeSection = 'orders'; // Default section if no URL
      return;
    }
    
    if (url.includes('/vendor/orders')) {
      this.activeSection = 'orders';
    } else if (url.includes('/vendor/upload')) {
      this.activeSection = 'upload';
    } else if (url.includes('/vendor/inventory')) {
      this.activeSection = 'inventory';
    } else if (url.includes('/vendor/routes')) {
      this.activeSection = 'routes';
    } else if (url.includes('/vendor/reports')) {
      this.activeSection = 'reports';
    } else if (url === '/vendor') {
      this.activeSection = 'orders'; // Default section
    }
  }

  logout(){ 
    sessionStorage.clear(); 
    this.router.navigate(['/']); 
  }

         createOrder(){
           const newOrder = {
             id: 'ORD-' + (1000 + this.orders.length + 1),
             product: 'Producto ejemplo - ' + new Date().toLocaleTimeString(),
             status: 'Creado'
           };
           this.orders.unshift(newOrder);
           alert('Pedido creado (mock). Inventario actualizado (simulado).');
         }

         openOrderCreation() {
           this.showOrderCreation = true;
           this.orderForm = {
             clientName: '',
             clientAddress: '',
             deliveryDate: '',
             generateRoute: false,
             products: []
           };
           document.body.classList.add('modal-open');
         }

         closeOrderCreation() {
           this.showOrderCreation = false;
           document.body.classList.remove('modal-open');
         }

         addProductToOrder() {
           if (this.orderForm.products.length < 5) {
             this.orderForm.products.push({
               product: '',
               quantity: 1,
               selected: false
             });
           }
         }

         removeProductFromOrder(index: number) {
           this.orderForm.products.splice(index, 1);
         }

         getAvailableProducts() {
           return this.inventory.filter(item => item.stock > 0);
         }

         getProductStock(productName: string): number {
           const product = this.inventory.find(item => item.name === productName);
           return product ? product.stock : 0;
         }

         getSelectedProductsText(): string {
           return this.orderForm.products
             .filter((p: any) => p.product)
             .map((p: any) => `${p.product} (${p.quantity})`)
             .join(', ');
         }

         createNewOrder() {
           if (this.orderForm.clientName && this.orderForm.clientAddress && this.orderForm.deliveryDate && this.orderForm.products.length > 0) {
             const selectedProducts = this.orderForm.products.filter((p: any) => p.product && p.quantity > 0);
             
             if (selectedProducts.length === 0) {
               alert('Debe seleccionar al menos un producto');
               return;
             }

             // If route generation is requested, show route generation section
             if (this.orderForm.generateRoute) {
               this.showRouteGenerationInOrder = true;
               this.selectedRouteInOrder = null;
               this.selectedVehicleInOrder = null;
               
               // Initialize map for route generation
               setTimeout(() => {
                 this.initializeMapForOrder();
                 this.showAllRoutesForOrder();
               }, 100);
               return;
             }

             // Create order without route generation
             this.finalizeOrderCreation();
           } else {
             alert('Por favor complete todos los campos requeridos');
           }
         }

  finalizeOrderCreation() {
    const selectedProducts = this.orderForm.products.filter((p: any) => p.product && p.quantity > 0);
    const user = this.authService.getUser();
    
    if (!user || !user.id) {
      alert('Error: Usuario no autenticado');
      return;
    }
    
    // Buscar productos en el inventario para obtener IDs y precios
    const orderProducts = selectedProducts.map((p: any) => {
      const inventoryItem = this.inventory.find(item => item.name === p.product);
      return {
        productId: inventoryItem?._id || '',
        productName: p.product,
        quantity: p.quantity,
        price: inventoryItem?.price || 0
      };
    }).filter(p => p.productId); // Solo productos que existen en inventario
    
    if (orderProducts.length === 0) {
      alert('Error: No se encontraron productos válidos en el inventario');
      return;
    }
    
    const totalAmount = orderProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    // Crear pedido usando el servicio
    const newOrderData = {
      vendorId: user.id,
      clientId: '', // Se puede obtener del formulario si hay campo para cliente
      products: orderProducts,
      deliveryAddress: this.orderForm.clientAddress,
      deliveryDate: this.orderForm.deliveryDate,
      contactName: this.orderForm.clientName,
      contactPhone: '',
      notes: '',
      status: 'Creado' as const,
      totalAmount: totalAmount
    };
    
    this.orderService.createOrder(newOrderData).subscribe({
      next: (response) => {
        alert('Pedido creado exitosamente');
        this.closeOrderCreation();
        this.loadOrders(); // Recargar pedidos
        this.loadInventory(); // Recargar inventario
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Error al crear el pedido: ' + (error.message || 'Error desconocido'));
      }
    });
  }

         selectRouteInOrder(route: any) {
           this.selectedRouteInOrder = route;
           this.highlightSelectedRouteInOrder(route);
         }

  assignRouteInOrder() {
    if (this.selectedRouteInOrder && this.selectedVehicleInOrder) {
      const user = this.authService.getUser();
      if (!user || !user.id) {
        alert('Error: Usuario no autenticado');
        return;
      }
      
      const selectedProducts = this.orderForm.products.filter((p: any) => p.product && p.quantity > 0);
      
      // Buscar productos en el inventario para obtener IDs y precios
      const orderProducts = selectedProducts.map((p: any) => {
        const inventoryItem = this.inventory.find(item => item.name === p.product);
        return {
          productId: inventoryItem?._id || '',
          productName: p.product,
          quantity: p.quantity,
          price: inventoryItem?.price || 0
        };
      }).filter(p => p.productId);
      
      if (orderProducts.length === 0) {
        alert('Error: No se encontraron productos válidos en el inventario');
        return;
      }
      
      const totalAmount = orderProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      // Crear la ruta primero
      const routeData = {
        vendorId: user.id,
        vehicleId: this.selectedVehicleInOrder.id,
        vehicleType: this.selectedVehicleInOrder.type || this.selectedVehicleInOrder.id,
        driverName: 'Conductor Asignado',
        stops: this.selectedRouteInOrder.coordinates?.map((coord: [number, number], index: number) => ({
          orderId: '', // Se actualizará después de crear el pedido
          address: this.orderForm.clientAddress,
          coordinates: { lat: coord[0], lng: coord[1] },
          sequence: index + 1
        })) || [],
        estimatedDistance: parseFloat(this.selectedRouteInOrder.distance) || 0,
        estimatedDuration: parseInt(this.selectedRouteInOrder.duration) || 0,
        estimatedFuel: parseFloat(this.selectedRouteInOrder.fuel) || 0,
        status: 'Programado' as const,
        progress: 0
      };
      
      this.logisticsService.createRoute(routeData).subscribe({
        next: (routeResponse) => {
          // Crear el pedido con la ruta asignada
          const newOrderData = {
            vendorId: user.id,
            clientId: '',
            products: orderProducts,
            deliveryAddress: this.orderForm.clientAddress,
            deliveryDate: this.orderForm.deliveryDate,
            contactName: this.orderForm.clientName,
            contactPhone: '',
            notes: '',
            status: 'Programado' as const,
            routeId: routeResponse.route._id,
            totalAmount: totalAmount
          };
          
          this.orderService.createOrder(newOrderData).subscribe({
            next: () => {
              alert('Pedido creado y programado exitosamente');
              this.closeOrderCreation();
              this.loadOrders();
              this.loadInventory();
              this.loadRoutes();
            },
            error: (error) => {
              console.error('Error creating order:', error);
              alert('Error al crear el pedido');
            }
          });
        },
        error: (error) => {
          console.error('Error creating route:', error);
          alert('Error al crear la ruta');
        }
      });
    } else {
      alert('Debe seleccionar una ruta y un vehículo');
    }
  }

         backToOrderForm() {
           this.showRouteGenerationInOrder = false;
           this.selectedRouteInOrder = null;
           this.selectedVehicleInOrder = null;
           
           // Clean up map
           if (this.map) {
             this.map.remove();
             this.map = null;
           }
           this.routeLayers = [];
         }

         // Order table actions
         viewOrderDetails(order: any) {
           this.selectedOrderForDetails = order;
           this.showOrderDetails = true;
           document.body.classList.add('modal-open');
         }

         closeOrderDetails() {
           this.showOrderDetails = false;
           this.selectedOrderForDetails = null;
           document.body.classList.remove('modal-open');
         }

         editOrder(order: any) {
           if (order.status === 'Creado' || order.status === 'Programado') {
             this.selectedOrderForEdit = order;
             this.showOrderEdit = true;
             
             // Populate form with order data
             this.orderForm = {
               clientName: order.client || '',
               clientAddress: order.address || '',
               deliveryDate: order.deliveryDate || '',
               generateRoute: order.status === 'Programado',
               products: order.products ? [...order.products] : []
             };
             
             document.body.classList.add('modal-open');
           }
         }

         closeOrderEdit() {
           this.showOrderEdit = false;
           this.selectedOrderForEdit = null;
           document.body.classList.remove('modal-open');
         }

         updateOrder() {
           if (this.selectedOrderForEdit) {
             const orderIndex = this.orders.findIndex(o => o.id === this.selectedOrderForEdit.id);
             if (orderIndex !== -1) {
               const selectedProducts = this.orderForm.products.filter((p: any) => p.product && p.quantity > 0);
               
               this.orders[orderIndex] = {
                 ...this.orders[orderIndex],
                 product: selectedProducts.map((p: any) => `${p.product} (${p.quantity})`).join(', '),
                 status: this.orderForm.generateRoute ? 'Programado' : 'Creado',
                 products: selectedProducts
               } as any;
             }
             
             alert('Orden actualizada exitosamente');
             this.closeOrderEdit();
           }
         }

         confirmDeleteOrder(order: any) {
           if (order.status === 'Creado' || order.status === 'Completado') {
             this.orderToDelete = order;
             this.showDeleteConfirmation = true;
             document.body.classList.add('modal-open');
           }
         }

         closeDeleteConfirmation() {
           this.showDeleteConfirmation = false;
           this.orderToDelete = null;
           document.body.classList.remove('modal-open');
         }

         deleteOrder() {
           if (this.orderToDelete) {
             const orderIndex = this.orders.findIndex(o => o.id === this.orderToDelete.id);
             if (orderIndex !== -1) {
               this.orders.splice(orderIndex, 1);
             }
             
             alert('Orden eliminada exitosamente');
             this.closeDeleteConfirmation();
           }
         }

         canEditOrder(order: any): boolean {
           return order.status === 'Creado' || order.status === 'Programado';
         }

         canDeleteOrder(order: any): boolean {
           return order.status === 'Creado' || order.status === 'Completado';
         }

         // Inventory details methods
         viewInventoryDetails(item: any) {
           this.selectedInventoryItem = item;
           this.showInventoryDetails = true;
           document.body.classList.add('modal-open');
         }

         closeInventoryDetails() {
           this.showInventoryDetails = false;
           this.selectedInventoryItem = null;
           document.body.classList.remove('modal-open');
         }

         // Reports methods
         updateReportData() {
           // Update orders by status
           this.reportData.ordersByStatus.data = [
             this.orders.filter(o => o.status === 'Creado').length,
             this.orders.filter(o => o.status === 'Programado').length,
             this.orders.filter(o => o.status === 'En Tránsito').length,
             this.orders.filter(o => o.status === 'Completado').length,
             this.orders.filter(o => o.status === 'Pendiente').length
           ];

           // Update inventory status
           const today = new Date();
           const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
           
           let normalStock = 0;
           let lowStock = 0;
           let expiringSoon = 0;
           let expired = 0;

           this.inventory.forEach(item => {
             if (item.stock >= 25) {
               normalStock++;
             } else if (item.stock < 10) {
               lowStock++;
             }

             const expiryDate = new Date(item.expiry);
             const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

             if (daysUntilExpiry < 0) {
               expired++;
             } else if (daysUntilExpiry < 30) {
               expiringSoon++;
             }
           });

           this.reportData.inventoryStatus.data = [normalStock, lowStock, expiringSoon, expired];
         }

         getTotalReturns(): number {
           return this.routeOrders.filter(order => order.returnRequested === true).length;
         }

         getReturnsByReason() {
           const returns = this.routeOrders.filter(order => order.returnRequested === true);
           const reasons = {
             'Producto Defectuoso': 0,
             'Pedido Incorrecto': 0,
             'Daño en Transporte': 0,
             'Cliente No Satisfecho': 0
           };

           returns.forEach(order => {
             if (order.returnReason) {
               if (order.returnReason.includes('defectuoso')) {
                 reasons['Producto Defectuoso']++;
               } else if (order.returnReason.includes('incorrecto')) {
                 reasons['Pedido Incorrecto']++;
               } else if (order.returnReason.includes('daño') || order.returnReason.includes('transporte')) {
                 reasons['Daño en Transporte']++;
               } else {
                 reasons['Cliente No Satisfecho']++;
               }
             }
           });

           return reasons;
         }

         // Chart helper methods
         getBarPercentage(value: number): number {
           const maxValue = Math.max(...this.reportData.ordersByStatus.data, ...this.reportData.inventoryStatus.data);
           return maxValue > 0 ? (value / maxValue) * 100 : 0;
         }

         getLineChartPoints(): string {
           const points = this.reportData.ordersByMonth.data.map((value, index) => {
             const x = (index * 60) + 30;
             const y = 180 - (value * 6);
             return `${x},${y}`;
           });
           return points.join(' ');
         }

         getLineChartPointsArray(): Array<{x: number, y: number}> {
           return this.reportData.ordersByMonth.data.map((value, index) => ({
             x: (index * 60) + 30,
             y: 180 - (value * 6)
           }));
         }

         // Upload methods
         onFileSelected(event: any) {
           if (!event || !event.target || !event.target.files) {
             return;
           }
           const file = event.target.files[0];
           if (file) {
             const fileExtension = file.name.split('.').pop()?.toLowerCase();
             if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
               this.selectedFile = file;
               this.uploadMessage = `Archivo seleccionado: ${file.name}`;
             } else {
               this.uploadMessage = 'Por favor seleccione un archivo CSV o Excel (.xlsx, .xls)';
               this.selectedFile = null;
             }
           }
         }

         downloadTemplate() {
           // Create CSV template with all inventory fields
           const headers = [
             'name',
             'stock',
             'price',
             'expiry',
             'lot',
             'warehouse',
             'supplier',
             'category',
             'description',
             'batches'
           ];

           const sampleData = [
             'Insulina',
             '45',
             '25.50',
             '2025-12-15',
             'INS-2024-001',
             'Bodega Principal - Zona A',
             'MedSupply Corp',
             'Medicamento',
             'Insulina de acción rápida para tratamiento de diabetes',
             'INS-2024-001-A:25:2025-12-15:Estante A1;INS-2024-001-B:20:2025-12-20:Estante A2'
           ];

           const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
           
           const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
           const link = document.createElement('a');
           const url = URL.createObjectURL(blob);
           link.setAttribute('href', url);
           link.setAttribute('download', 'plantilla_inventario.csv');
           link.style.visibility = 'hidden';
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
         }

         uploadFile() {
           if (!this.selectedFile) {
             this.uploadMessage = 'Por favor seleccione un archivo';
             return;
           }

           this.isUploading = true;
           this.uploadProgress = 0;
           this.uploadMessage = 'Validando archivo...';

           // Validate and process file
           this.validateAndProcessFile();
         }

         validateAndProcessFile() {
           if (!this.selectedFile) return;

           const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
           
           if (fileExtension === 'csv') {
             this.parseCSVFile();
           } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
             this.uploadMessage = 'Procesamiento de archivos Excel no implementado aún. Use formato CSV.';
             this.isUploading = false;
             this.showUploadSuccess = false;
           }
         }

         parseCSVFile() {
           if (!this.selectedFile) return;

           Papa.parse(this.selectedFile, {
             header: true,
             skipEmptyLines: true,
             complete: (results) => {
               this.uploadProgress = 50;
               this.uploadMessage = 'Validando estructura del archivo...';
               
               const validationResult = this.validateCSVData(results.data, results.meta.fields || []);
               
               if (validationResult.isValid) {
                 this.uploadProgress = 100;
                 this.uploadMessage = 'Archivo válido. Procesando datos...';
                 setTimeout(() => {
                   this.processValidatedData(results.data);
                 }, 500);
               } else {
                 this.handleValidationErrors(validationResult.errors);
               }
             },
             error: (error) => {
               this.handleFileError('Error al leer el archivo CSV: ' + error.message);
             }
           });
         }

         validateCSVData(data: any[], headers: string[]): {isValid: boolean, errors: string[]} {
           const errors: string[] = [];

           // Check required columns
           const missingColumns = this.REQUIRED_COLUMNS.filter(col => !headers.includes(col));
           if (missingColumns.length > 0) {
             errors.push(`Faltan las siguientes columnas requeridas: ${missingColumns.join(', ')}`);
           }

           // Check for empty data
           if (data.length === 0) {
             errors.push('El archivo está vacío o no contiene datos válidos');
           }

           // Validate each row
           data.forEach((row, index) => {
             const rowNumber = index + 2; // +2 because CSV starts from row 2 (after header)

             // Check required fields are not empty
             this.REQUIRED_COLUMNS.forEach(column => {
               if (headers.includes(column) && (!row[column] || row[column].toString().trim() === '')) {
                 errors.push(`Fila ${rowNumber}: El campo '${column}' está vacío`);
               }
             });

             // Validate specific field formats
             if (row.stock && isNaN(Number(row.stock))) {
               errors.push(`Fila ${rowNumber}: El campo 'stock' debe ser un número válido`);
             }

             if (row.price && isNaN(Number(row.price))) {
               errors.push(`Fila ${rowNumber}: El campo 'price' debe ser un número válido`);
             }

             // Validate date format (YYYY-MM-DD)
             if (row.expiry && !this.isValidDate(row.expiry)) {
               errors.push(`Fila ${rowNumber}: El campo 'expiry' debe tener formato YYYY-MM-DD (fecha encontrada: ${row.expiry})`);
             }

             // Validate batches format (LOTE:CANTIDAD:FECHA:UBICACIÓN)
             if (row.batches && !this.isValidBatchesFormat(row.batches)) {
               errors.push(`Fila ${rowNumber}: El campo 'batches' debe tener formato LOTE:CANTIDAD:FECHA:UBICACIÓN separado por punto y coma`);
             }
           });

           return {
             isValid: errors.length === 0,
             errors: errors
           };
         }

  isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    // Parse the date components directly to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Create date using local timezone to avoid UTC conversion issues
    const date = new Date(year, month - 1, day);
    
    // Check if the date is valid
    if (!(date instanceof Date) || isNaN(date.getTime())) return false;
    
    // Verify the date components match exactly
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  }

         isValidBatchesFormat(batches: string): boolean {
           if (!batches || batches.trim() === '') return true; // Allow empty batches
           
           const batchEntries = batches.split(';');
           const batchRegex = /^[^:]+:\d+:\d{4}-\d{2}-\d{2}:[^:]+$/;
           
           return batchEntries.every(entry => batchRegex.test(entry.trim()));
         }

         handleValidationErrors(errors: string[]) {
           this.isUploading = false;
           this.uploadProgress = 0;
           this.showUploadSuccess = false;
           
           const errorMessage = 'Errores encontrados en el archivo:\n\n' + errors.slice(0, 10).join('\n');
           if (errors.length > 10) {
             this.uploadMessage = errorMessage + `\n\n... y ${errors.length - 10} errores más.`;
           } else {
             this.uploadMessage = errorMessage;
           }
         }

         handleFileError(errorMessage: string) {
           this.isUploading = false;
           this.uploadProgress = 0;
           this.showUploadSuccess = false;
           this.uploadMessage = errorMessage;
         }

         processValidatedData(data: any[]) {
           // Process the validated CSV data
           this.processUploadedFileWithData(data);
         }

         processUploadedFileWithData(csvData: any[]) {
           // Add validated CSV data to inventory
           csvData.forEach(item => {
             this.inventory.push({
               name: item.name,
               stock: Number(item.stock),
               price: Number(item.price),
               expiry: item.expiry,
               lot: item.lot,
               warehouse: item.warehouse,
               supplier: item.supplier,
               category: item.category,
               description: item.description,
               batches: this.parseBatches(item.batches)
             });
           });

           this.updateReportData();

           this.isUploading = false;
           this.uploadMessage = `Archivo procesado exitosamente. Se agregaron ${csvData.length} productos al inventario.`;
           this.showUploadSuccess = true;
           this.selectedFile = null;

           // Reset form
           const fileInput = document.getElementById('fileInput') as HTMLInputElement;
           if (fileInput) {
             fileInput.value = '';
           }

           // Hide success message after 5 seconds
           setTimeout(() => {
             this.showUploadSuccess = false;
             this.uploadMessage = '';
             this.uploadProgress = 0;
           }, 5000);
         }

         parseBatches(batchesString: string): any[] {
           if (!batchesString || batchesString.trim() === '') return [];
           
           return batchesString.split(';').map(batch => {
             const parts = batch.trim().split(':');
             return {
               batch: parts[0],
               quantity: Number(parts[1]),
               expiry: parts[2],
               location: parts[3]
             };
           });
         }

         processUploadedFile() {
           // Simulate processing CSV/Excel file
           // In a real application, you would parse the file and update inventory
           
           // Mock data for demonstration (in real app, this would come from validated CSV data)
           const newInventoryItems = [
             {
               name: 'Paracetamol',
               stock: 100,
               price: 2.50,
               expiry: '2026-03-15',
               lot: 'PAR-2024-005',
               warehouse: 'Bodega Principal - Zona A',
               supplier: 'PharmaCorp',
               category: 'Medicamento',
               description: 'Analgésico y antipirético',
               batches: [
                 {batch: 'PAR-2024-005-A', quantity: 50, expiry: '2026-03-15', location: 'Estante A3'},
                 {batch: 'PAR-2024-005-B', quantity: 50, expiry: '2026-03-20', location: 'Estante A4'}
               ]
             },
             {
               name: 'Termómetro Digital',
               stock: 25,
               price: 15.00,
               expiry: '2027-01-10',
               lot: 'TER-2024-006',
               warehouse: 'Bodega Secundaria - Zona B',
               supplier: 'MedEquip Solutions',
               category: 'Equipo Médico',
               description: 'Termómetro digital infrarrojo',
               batches: [
                 {batch: 'TER-2024-006-A', quantity: 25, expiry: '2027-01-10', location: 'Estante B4'}
               ]
             }
           ];

           // Add new items to inventory
           this.inventory.push(...newInventoryItems);

           // Update report data
           this.updateReportData();

           this.isUploading = false;
           this.uploadMessage = `Archivo procesado exitosamente. Se agregaron ${newInventoryItems.length} productos al inventario.`;
           this.showUploadSuccess = true;
           this.selectedFile = null;

           // Reset form
           const fileInput = document.getElementById('fileInput') as HTMLInputElement;
           if (fileInput) {
             fileInput.value = '';
           }

           // Hide success message after 5 seconds
           setTimeout(() => {
             this.showUploadSuccess = false;
             this.uploadMessage = '';
             this.uploadProgress = 0;
           }, 5000);
         }

         clearUpload() {
           this.selectedFile = null;
           this.uploadMessage = '';
           this.uploadProgress = 0;
           this.isUploading = false;
           this.showUploadSuccess = false;
           
           const fileInput = document.getElementById('fileInput') as HTMLInputElement;
           if (fileInput) {
             fileInput.value = '';
           }
         }

  getPendingOrders(): number {
    return this.orders.filter(order => order.status === 'Pendiente' || order.status === 'Creado' || order.status === 'Programado').length;
  }

  getCompletedOrders(): number {
    return this.orders.filter(order => order.status === 'Completado').length;
  }

  getTotalItems(): number {
    return this.inventory.length;
  }

  getLowStockItems(): number {
    return this.inventory.filter(item => item.stock < 10).length;
  }

  getExpiringItems(): number {
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.inventory.filter(item => {
      const expiryDate = new Date(item.expiry);
      return expiryDate <= nextMonth;
    }).length;
  }

  getStockClass(stock: number): string {
    if (stock < 10) return 'low-stock';
    if (stock < 25) return 'medium-stock';
    return 'good-stock';
  }

  getExpiryClass(expiry: string): string {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry < 30) return 'expiring-soon';
    return 'good-expiry';
  }

  // Routes module methods
  getTotalRoutes(): number {
    return this.routes.length;
  }

  getPendingRoutes(): number {
    return this.getOrdersWithoutRoute().length;
  }

  getActiveRoutes(): number {
    return this.routes.filter(route => route.status === 'En Tránsito').length;
  }

  getReturnRequests(): number {
    return this.getDeliveredWithReturns().length;
  }

  getOrdersWithoutRoute() {
    return this.routeOrders.filter(order => order.status === 'Sin Ruta');
  }

  getActiveRoutesList() {
    return this.routes.filter(route => route.status === 'En Tránsito');
  }

  getDeliveredWithReturns() {
    return this.routeOrders.filter(order => order.returnRequested === true);
  }

  generateOptimalRoutes(order: any) {
    this.selectedOrder = order;
    this.showRouteGeneration = true;
    this.selectedRoute = null;
    this.selectedVehicle = null;
    
    // Generar rutas optimizadas usando el servicio
    if (order.id) {
      this.logisticsService.generateOptimalRoutes([order.id]).subscribe({
        next: (response) => {
          this.suggestedRoutes = response.suggestedRoutes;
          // Add class to body to hide sidebar
          document.body.classList.add('modal-open');
          
          // Initialize map after modal opens
          setTimeout(() => {
            this.initializeMap();
            this.showAllRoutes();
          }, 100);
        },
        error: (error) => {
          console.error('Error generating routes:', error);
          alert('Error al generar rutas optimizadas');
        }
      });
    }
  }

         closeRouteGeneration() {
           this.showRouteGeneration = false;
           this.selectedOrder = null;
           this.selectedRoute = null;
           this.selectedVehicle = null;
           // Remove class from body to show sidebar
           document.body.classList.remove('modal-open');
           
           // Clean up map
           if (this.map) {
             this.map.remove();
             this.map = null;
           }
           this.routeLayers = [];
         }

  selectRoute(route: any) {
    this.selectedRoute = route;
    this.highlightSelectedRoute(route);
  }

  assignRoute() {
    if (this.selectedRoute && this.selectedVehicle && this.selectedOrder) {
      const user = this.authService.getUser();
      if (!user || !user.id) {
        alert('Error: Usuario no autenticado');
        return;
      }
      
      // Crear la ruta usando el servicio
      const routeData = {
        vendorId: user.id,
        vehicleId: this.selectedVehicle.id,
        vehicleType: this.selectedVehicle.type || this.selectedVehicle.id,
        driverName: 'Conductor Asignado',
        stops: this.selectedRoute.coordinates?.map((coord: [number, number], index: number) => ({
          orderId: this.selectedOrder.id,
          address: this.selectedOrder.address || '',
          coordinates: { lat: coord[0], lng: coord[1] },
          sequence: index + 1
        })) || [],
        estimatedDistance: parseFloat(this.selectedRoute.distance) || 0,
        estimatedDuration: parseInt(this.selectedRoute.duration) || 0,
        estimatedFuel: parseFloat(this.selectedRoute.fuel) || 0,
        status: 'Programado' as const,
        progress: 0
      };
      
      this.logisticsService.createRoute(routeData).subscribe({
        next: (response) => {
          // Actualizar el pedido con el routeId
          if (this.selectedOrder.id) {
            this.orderService.updateOrder(this.selectedOrder.id, {
              routeId: response.route._id,
              status: 'Programado'
            }).subscribe({
              next: () => {
                alert('Ruta asignada exitosamente');
                this.closeRouteGeneration();
                this.loadOrders();
                this.loadRoutes();
              },
              error: (error) => {
                console.error('Error updating order:', error);
                alert('Ruta creada pero error al actualizar pedido');
              }
            });
          }
        },
        error: (error) => {
          console.error('Error creating route:', error);
          alert('Error al asignar ruta: ' + (error.message || 'Error desconocido'));
        }
      });
    }
  }

  markAsDelivered(route: any) {
    if (!route._id && !route.id) {
      alert('Error: Ruta inválida');
      return;
    }
    
    const routeId = route._id || route.id;
    
    // Actualizar la ruta
    this.logisticsService.updateRoute(routeId, {
      status: 'Completado',
      progress: 100,
      endTime: new Date().toISOString()
    }).subscribe({
      next: () => {
        // Actualizar pedidos asociados
        const ordersToUpdate = this.routeOrders.filter(o => o.routeId === routeId);
        ordersToUpdate.forEach(order => {
          if (order.id) {
            this.orderService.updateOrder(order.id, {
              status: 'Completado'
            }).subscribe({
              error: (error) => console.error('Error updating order:', error)
            });
          }
        });
        
        alert('Entrega marcada como completada');
        this.loadRoutes();
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error marking route as delivered:', error);
        alert('Error al marcar entrega como completada');
      }
    });
  }

  processReturn(order: any) {
    if (!order.id && !order._id) {
      alert('Error: Pedido inválido');
      return;
    }
    
    const orderId = order._id || order.id;
    
    // Actualizar el pedido con el estado de devolución procesada
    this.orderService.updateOrder(orderId, {
      returnStatus: 'Procesada'
    }).subscribe({
      next: () => {
        alert('Devolución procesada');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error processing return:', error);
        alert('Error al procesar devolución');
      }
    });
  }

  // Map methods
  private initializeMap() {
    if (this.mapContainer && !this.map) {
      // Initialize map centered on Bogotá
      this.map = L.map(this.mapContainer.nativeElement).setView([4.6097, -74.0817], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  private showAllRoutes() {
    if (!this.map) return;

    // Clear existing route layers
    this.routeLayers.forEach(layer => this.map?.removeLayer(layer));
    this.routeLayers = [];

    // Show both suggested routes
    this.suggestedRoutes.forEach((route, index) => {
      this.addRouteToMap(route, index === 0 ? '#1976d2' : '#ff9800', index);
    });
  }

  private addRouteToMap(route: any, color: string, routeIndex: number) {
    if (!this.map) return;

    const routeLayer = L.layerGroup();
    
    // Add markers for each location
    route.coordinates.forEach((coord: [number, number], index: number) => {
      const isWarehouse = index === 0;
      const marker = L.circleMarker(coord, {
        radius: isWarehouse ? 12 : 8,
        fillColor: isWarehouse ? '#4caf50' : color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Add popup with location info
      const popupContent = `
        <div class="route-popup">
          <h4>${route.route[index]}</h4>
          <p><strong>Tipo:</strong> ${isWarehouse ? 'Almacén' : 'Destino'}</p>
          <p><strong>Orden:</strong> ${index + 1}</p>
      </div>
      `;
      marker.bindPopup(popupContent);
      routeLayer.addLayer(marker);
    });

    // Add route line
    const routeLine = L.polyline(route.coordinates, {
      color: color,
      weight: 4,
      opacity: 0.7,
      dashArray: routeIndex === 0 ? '10, 10' : '5, 5'
    });

    // Add route info popup to the line
    const routeInfo = `
      <div class="route-popup">
        <h4>${route.id}</h4>
        <p><strong>Distancia:</strong> ${route.distance} km</p>
        <p><strong>Duración:</strong> ${route.duration}</p>
        <p><strong>Combustible:</strong> ${route.fuel} L</p>
        <p><strong>Paradas:</strong> ${route.stops}</p>
      </div>
    `;
    routeLine.bindPopup(routeInfo);
    routeLayer.addLayer(routeLine);

    // Add to map and store reference
    this.map.addLayer(routeLayer);
    this.routeLayers.push(routeLayer);
  }

  private highlightSelectedRoute(selectedRoute: any) {
    if (!this.map) return;

    // Reset all routes to normal opacity
    this.routeLayers.forEach((layer, index) => {
      layer.eachLayer((layer: any) => {
        if (layer instanceof L.Polyline) {
          layer.setStyle({ opacity: 0.7, weight: 4 });
        }
      });
    });

    // Highlight selected route
    const selectedIndex = this.suggestedRoutes.findIndex(route => route.id === selectedRoute.id);
    if (selectedIndex !== -1 && this.routeLayers[selectedIndex]) {
      this.routeLayers[selectedIndex].eachLayer((layer: any) => {
        if (layer instanceof L.Polyline) {
          layer.setStyle({ opacity: 1, weight: 6 });
        }
      });
    }
  }

  // Map methods for order creation
  private initializeMapForOrder() {
    if (this.mapContainer && !this.map) {
      // Initialize map centered on Bogotá
      this.map = L.map(this.mapContainer.nativeElement).setView([4.6097, -74.0817], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  private showAllRoutesForOrder() {
    if (!this.map) return;

    // Clear existing route layers
    this.routeLayers.forEach(layer => this.map?.removeLayer(layer));
    this.routeLayers = [];

    // Show both suggested routes
    this.suggestedRoutes.forEach((route, index) => {
      this.addRouteToMap(route, index === 0 ? '#1976d2' : '#ff9800', index);
    });
  }

  private highlightSelectedRouteInOrder(selectedRoute: any) {
    if (!this.map) return;

    // Reset all routes to normal opacity
    this.routeLayers.forEach((layer, index) => {
      layer.eachLayer((layer: any) => {
        if (layer instanceof L.Polyline) {
          layer.setStyle({ opacity: 0.7, weight: 4 });
        }
      });
    });

    // Highlight selected route
    const selectedIndex = this.suggestedRoutes.findIndex(route => route.id === selectedRoute.id);
    if (selectedIndex !== -1 && this.routeLayers[selectedIndex]) {
      this.routeLayers[selectedIndex].eachLayer((layer: any) => {
        if (layer instanceof L.Polyline) {
          layer.setStyle({ opacity: 1, weight: 6 });
        }
      });
    }
  }
}
