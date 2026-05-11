const Warehouse = require('../models/Warehouse');
const Shipment = require('../models/Shipment');
const generateQRCode = require('../utils/generateQRCode');

exports.seedShipments = async (req, res, next) => {
  try {
    // Check secret
    const seedSecret = req.headers['x-seed-secret'];
    if (process.env.NODE_ENV === 'production' && seedSecret !== process.env.SEED_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Invalid seed secret' });
    }
    if (process.env.NODE_ENV !== 'production' && seedSecret && seedSecret !== process.env.SEED_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid seed secret' });
    }

    // Clear existing seed data
    await Warehouse.deleteMany({});
    await Shipment.deleteMany({});

    // Create warehouses
    const warehouses = await Warehouse.create([
      { name: 'Delhi NCR Mega Hub', address: 'Plot 12, Sector 18, Gurugram', city: 'Delhi NCR', latitude: 28.4595, longitude: 77.0266, capacity: 10000, phone: '+91-11-40001000', isActive: true },
      { name: 'Mumbai Central Warehouse', address: 'Andheri East, MIDC Industrial Area', city: 'Mumbai', latitude: 19.1136, longitude: 72.8697, capacity: 8000, phone: '+91-22-40002000', isActive: true },
      { name: 'Bangalore Tech Park Hub', address: 'Electronic City Phase 2', city: 'Bangalore', latitude: 12.8399, longitude: 77.6770, capacity: 6000, phone: '+91-80-40003000', isActive: true },
      { name: 'Kolkata East Hub', address: 'Salt Lake Sector V, Bidhannagar', city: 'Kolkata', latitude: 22.5726, longitude: 88.3639, capacity: 5000, phone: '+91-33-40004000', isActive: true },
      { name: 'Hyderabad HITEC Hub', address: 'HITEC City, Madhapur', city: 'Hyderabad', latitude: 17.4435, longitude: 78.3772, capacity: 7000, phone: '+91-40-40005000', isActive: true },
      { name: 'Bhubaneswar Central Hub', address: 'Patia, Chandrasekharpur', city: 'Bhubaneswar', latitude: 20.3540, longitude: 85.8175, capacity: 3000, phone: '+91-674-4006000', isActive: true }
    ]);

    const now = new Date();
    const day = (d) => new Date(now.getTime() - d * 86400000);
    const hr = (h) => new Date(now.getTime() - h * 3600000);

    // Generate QR codes
    const qr1 = await generateQRCode({ trackingId: 'TS-DEL-2026-1001', type: 'shipment' });
    const qr2 = await generateQRCode({ trackingId: 'TS-MUM-2026-1002', type: 'shipment' });
    const qr3 = await generateQRCode({ trackingId: 'TS-BLR-2026-1003', type: 'shipment' });
    const qr4 = await generateQRCode({ trackingId: 'TS-KOL-2026-1004', type: 'shipment' });
    const qr5 = await generateQRCode({ trackingId: 'TS-HYD-2026-1005', type: 'shipment' });

    const shipments = await Shipment.create([
      {
        trackingId: 'TS-DEL-2026-1001',
        senderName: 'TrackSphere Fulfillment Center',
        senderPhone: '+91-674-5001000',
        senderAddress: 'Patia, Chandrasekharpur, Bhubaneswar, Odisha 751024',
        receiverName: 'Aditya Dash',
        receiverPhone: '9999999999',
        receiverAddress: 'Cyber City, DLF Phase 2, Gurgaon, Haryana 122002',
        packageType: 'electronics',
        weight: 2.5,
        priority: 'high',
        status: 'out_for_delivery',
        assignedWarehouse: warehouses[0]._id,
        currentLocation: { address: 'Gurgaon Sector 29', lat: 28.4595, lng: 77.0266 },
        destinationLocation: { address: 'Gurgaon Cyber City', lat: 28.4949, lng: 77.0898 },
        estimatedDelivery: new Date(now.getTime() + 86400000),
        qrCode: qr1,
        history: [
          { status: 'pending', location: 'Bhubaneswar, Odisha', note: 'Shipment created and pickup scheduled', timestamp: day(4) },
          { status: 'picked_up', location: 'Bhubaneswar, Odisha', note: 'Package picked up from sender', timestamp: day(4) },
          { status: 'received_at_warehouse', location: 'Bhubaneswar Central Hub', note: 'Received at origin warehouse', timestamp: day(3) },
          { status: 'in_transit', location: 'En route to Delhi NCR', note: 'Package dispatched via express route', timestamp: day(2) },
          { status: 'received_at_warehouse', location: 'Delhi NCR Mega Hub', note: 'Arrived at destination hub', timestamp: day(1) },
          { status: 'out_for_delivery', location: 'Gurgaon Sector 29', note: 'Out for delivery - Driver en route', timestamp: hr(2) }
        ]
      },
      {
        trackingId: 'TS-MUM-2026-1002',
        senderName: 'Reliance Digital Store',
        senderPhone: '+91-22-6001000',
        senderAddress: 'Phoenix Mall, Lower Parel, Mumbai, Maharashtra 400013',
        receiverName: 'Priya Mehta',
        receiverPhone: '8888888888',
        receiverAddress: 'Koramangala 4th Block, Bangalore, Karnataka 560034',
        packageType: 'fragile',
        weight: 1.2,
        priority: 'urgent',
        status: 'in_transit',
        assignedWarehouse: warehouses[1]._id,
        currentLocation: { address: 'Mumbai-Pune Expressway', lat: 18.7546, lng: 73.4062 },
        destinationLocation: { address: 'Koramangala, Bangalore', lat: 12.9352, lng: 77.6245 },
        estimatedDelivery: new Date(now.getTime() + 2 * 86400000),
        qrCode: qr2,
        history: [
          { status: 'pending', location: 'Mumbai, Maharashtra', note: 'Order placed', timestamp: day(3) },
          { status: 'picked_up', location: 'Lower Parel, Mumbai', note: 'Picked up from store', timestamp: day(2) },
          { status: 'received_at_warehouse', location: 'Mumbai Central Warehouse', note: 'Processing at warehouse', timestamp: day(2) },
          { status: 'in_transit', location: 'Mumbai-Pune Expressway', note: 'In transit to Bangalore', timestamp: day(1) }
        ]
      },
      {
        trackingId: 'TS-BLR-2026-1003',
        senderName: 'Amazon Fulfillment',
        senderPhone: '+91-80-7001000',
        senderAddress: 'Devanahalli, Bangalore, Karnataka 562110',
        receiverName: 'Rohit Sharma',
        receiverPhone: '7777777777',
        receiverAddress: 'Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033',
        packageType: 'parcel',
        weight: 5.0,
        priority: 'medium',
        status: 'delivered',
        assignedWarehouse: warehouses[2]._id,
        currentLocation: { address: 'Jubilee Hills, Hyderabad', lat: 17.4326, lng: 78.4071 },
        destinationLocation: { address: 'Jubilee Hills, Hyderabad', lat: 17.4326, lng: 78.4071 },
        estimatedDelivery: day(1),
        deliveredAt: day(1),
        qrCode: qr3,
        history: [
          { status: 'pending', location: 'Bangalore, Karnataka', note: 'Shipment booked', timestamp: day(5) },
          { status: 'picked_up', location: 'Devanahalli, Bangalore', note: 'Picked up', timestamp: day(5) },
          { status: 'received_at_warehouse', location: 'Bangalore Tech Park Hub', note: 'At warehouse', timestamp: day(4) },
          { status: 'in_transit', location: 'Bangalore-Hyderabad route', note: 'Dispatched', timestamp: day(3) },
          { status: 'received_at_warehouse', location: 'Hyderabad HITEC Hub', note: 'Arrived at destination hub', timestamp: day(2) },
          { status: 'out_for_delivery', location: 'Hyderabad city', note: 'Out for delivery', timestamp: day(1) },
          { status: 'delivered', location: 'Jubilee Hills, Hyderabad', note: 'Delivered successfully - Signed by receiver', timestamp: day(1) }
        ]
      },
      {
        trackingId: 'TS-KOL-2026-1004',
        senderName: 'Flipkart Warehouse',
        senderPhone: '+91-33-8001000',
        senderAddress: 'Rajarhat New Town, Kolkata, West Bengal 700156',
        receiverName: 'Sneha Roy',
        receiverPhone: '6666666666',
        receiverAddress: 'Hazratganj, Lucknow, Uttar Pradesh 226001',
        packageType: 'document',
        weight: 0.5,
        priority: 'low',
        status: 'received_at_warehouse',
        assignedWarehouse: warehouses[3]._id,
        currentLocation: { address: 'Kolkata East Hub', lat: 22.5726, lng: 88.3639 },
        destinationLocation: { address: 'Hazratganj, Lucknow', lat: 26.8467, lng: 80.9462 },
        estimatedDelivery: new Date(now.getTime() + 4 * 86400000),
        qrCode: qr4,
        history: [
          { status: 'pending', location: 'Kolkata, West Bengal', note: 'Order confirmed', timestamp: day(2) },
          { status: 'picked_up', location: 'Rajarhat, Kolkata', note: 'Picked from warehouse', timestamp: day(1) },
          { status: 'received_at_warehouse', location: 'Kolkata East Hub', note: 'Processing for dispatch', timestamp: hr(6) }
        ]
      },
      {
        trackingId: 'TS-HYD-2026-1005',
        senderName: 'Myntra Fashion Hub',
        senderPhone: '+91-40-9001000',
        senderAddress: 'Gachibowli, Hyderabad, Telangana 500032',
        receiverName: 'Ananya Iyer',
        receiverPhone: '5555555555',
        receiverAddress: 'MG Road, Kochi, Kerala 682016',
        packageType: 'parcel',
        weight: 1.8,
        priority: 'medium',
        status: 'failed',
        assignedWarehouse: warehouses[4]._id,
        currentLocation: { address: 'Kochi Hub', lat: 9.9312, lng: 76.2673 },
        destinationLocation: { address: 'MG Road, Kochi', lat: 9.9816, lng: 76.2999 },
        estimatedDelivery: day(0),
        failureReason: 'Recipient not available at address - multiple attempts made',
        qrCode: qr5,
        history: [
          { status: 'pending', location: 'Hyderabad, Telangana', note: 'Order placed', timestamp: day(6) },
          { status: 'picked_up', location: 'Gachibowli, Hyderabad', note: 'Collected', timestamp: day(5) },
          { status: 'received_at_warehouse', location: 'Hyderabad HITEC Hub', note: 'At warehouse', timestamp: day(5) },
          { status: 'in_transit', location: 'Hyderabad-Kochi route', note: 'Dispatched', timestamp: day(4) },
          { status: 'out_for_delivery', location: 'Kochi city', note: 'Out for delivery', timestamp: day(2) },
          { status: 'failed', location: 'MG Road, Kochi', note: 'Delivery failed - Recipient not available after 3 attempts', timestamp: day(1) }
        ]
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Seed data created successfully',
      data: {
        warehouses: warehouses.length,
        shipments: shipments.length,
        trackingIds: shipments.map(s => s.trackingId)
      }
    });
  } catch (error) { next(error); }
};
