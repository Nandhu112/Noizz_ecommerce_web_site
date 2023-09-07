const dashboardHelper = require('../helpers/dashboardHelper') 
const orderHelper = require('../helpers/orderHelper')  
const productHelper = require('../helpers/productHelper');
const exceljs=require('exceljs')
const PdfPrinter=require('pdfmake')
const fs=require('fs')

const totalSaleExcel= async(req,res)=>{
    try {
    
  
        const totalSaleToday= await dashboardHelper.totalSaleToday()
      
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('orders');
        
        // Define the header columns
        const columns = [
          { header: "S:no", key: "s_no" },
          { header: "Id", key: "_id" },
          { header: "User Id", key: "userId" },
          { header: 'Product', key: "product" },
          { header: "Quantity", key: "quantity" },
          { header: "Total", key: "totalAmount" },
          { header: "Payment Method", key: "paymentMethod" },
          { header: "Delivered Status", key: "deliveredStatus" },
          { header: "Order Date", key: "date" },
          { header: "__v", key: "__v" }
        ];
        
        // Set the columns
        worksheet.columns = columns;
        
        let s_no = 1; // Initialize a counter
        
        // Flatten and add data to the worksheet
        totalSaleToday.forEach(order => {
          order.products.forEach(product => {
            worksheet.addRow({
              s_no: s_no++,
              _id: order._id,
              userId: order.userId,
              product: product.product, // Access 'product' from the nested structure
              quantity: product.quantity, // Access 'quantity' from the nested structure
              totalAmount: order.totalAmount,
              paymentMethod: order.paymentMethod,
              deliveredStatus: order.delivered ? order.delivered.status : '',
              date: order.date,
              __v: order.__v
            });
          });
        });
        
        // Style the header row
        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });
        
        // Set response headers for download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        
        res.setHeader("Content-Disposition", 'attachment;filename=todaysales.xlsx');
        
        // Send the workbook as a response
        return workbook.xlsx.write(res).then(() => {
          res.status(200).end();
        });
        
    } catch (error) {
      console.log(error)
    }
  }

  const totalRevenueExcel =async (req,res)=>{
    console.log("tdy revenue");
  try {
    const allOrder = await orderHelper .findOrdersDelivered() 
    console.log(allOrder,"tdy revenue");
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('orders');
    const columns = [
      { header: "S:no", key: "s_no" },
      { header: "Order Id", key: "_id" },
      { header: "User Id", key: "userId" },
      { header: "Total", key: "totalAmount" },
      { header: "Payment Method", key: "paymentMethod" },
      { header: "Delivered Status", key: "deliveredStatus" },
      { header: "Order Date", key: "date" },
      { header: "__v", key: "__v" }
    ];
      
        // Set the columns
        worksheet.columns = columns;
        
        let s_no = 1; // Initialize a counter
        
        // Flatten and add data to the worksheet
        allOrder.forEach(order => {
          order.products.forEach(product => {
            worksheet.addRow({
              s_no: s_no++,
              _id: order._id,
              userId: order.userId,
              totalAmount: order.totalAmount,
              paymentMethod: order.paymentMethod,
              deliveredStatus: order.delivered ? order.delivered.status : '',
              date: order.date,
              __v: order.__v
            });
          });
        });
        
        // Style the header row
        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });
        
  
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  
    res.setHeader("Content-Disposition", 'attachment;filename=revenue.xlsx');
    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error)
  }
  }

  const productListExcel = async (req,res)=>{

    try {
      const productModellist = await productHelper.getAllProducts()
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('orders');
      worksheet.columns = [
        { header: "S no", key: "s_no" },
        { header: "Id", key: "_id" },
        { header: "productName", key: "Name" },
        { header: "Category", key: "Category" },
        { header: "Description", key: "Description"},
        { header: "Price", key: "Price" }
      ];
      let counter = 1;
      productModellist.forEach(element => {
        element.s_no = counter;
        worksheet.addRow(element);
        counter++;
      });
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
  
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
  
      res.setHeader("Content-Disposition", 'attachment;filename=productList.xlsx');
      return workbook.xlsx.write(res).then(() => {
        res.status(200);
  
      });
    } catch (error) {
      console.log(error.message)
    }
  
  }

  const allOrderStatus = async (req,res)=>{
    try {
      const allOrder = await orderHelper.allOrders() 
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('orders');
      const columns = [
        { header: "S:no", key: "s_no" },
        { header: "Order Id", key: "_id" },
        { header: "User Id", key: "userId" },
        { header: 'Product', key: "product" },
        { header: "Quantity", key: "quantity" },
        { header: "Total", key: "totalAmount" },
        { header: "Payment Method", key: "paymentMethod" },
        { header: "Delivered Status", key: "deliveredStatus" },
        { header: "Order Date", key: "date" },
      
      ];
    
        worksheet.columns = columns;
          
          let s_no = 1; // Initialize a counter
          
          // Flatten and add data to the worksheet
          allOrder.forEach(order => {
            order.products.forEach(product => {
              worksheet.addRow({
                s_no: s_no++,
                _id: order._id,
                userId: order.userId,
                product: product.product, // Access 'product' from the nested structure
                quantity: product.quantity, // Access 'quantity' from the nested structure
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                deliveredStatus: order.delivered ? order.delivered.status : '',
                date: order.date,
                
              });
            });
          });
          
          // Style the header row
          worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
          });
          
    
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    
      res.setHeader("Content-Disposition", 'attachment;filename=orders.xlsx');
      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (error) {
      console.log(error)
    }
    }

    const orderDetailPDF = async (req,res)=>{
        try {
          const allOrder =await orderHelper.findOrdersDelivered_populated() 
          let totalAmount = 0;
        if (allOrder && allOrder.length > 0) {
          totalAmount = allOrder.reduce((total, order) => total + order.totalAmount, 0);
        }
        
        console.log(allOrder,totalAmount,"orderdetail pdf")
          res.render('./admin/salesPdf',{orders:allOrder,totalAmount})
        } catch (error) {
          console.log(error)
        }
        }

        const customPDF = async (req,res)=>{
            try {
              const startDate = req.query.start; // Get the starting date from the query parameters
                const endDate = req.query.end; // Get the ending date from the query parameters
                const allOrder = await orderHelper.findOrderByDate(startDate,endDate)
            
                console.log(allOrder.length,allOrder,"order pdf")
            
                let startY = 150;
                const writeStream = fs.createWriteStream("order.pdf");
                const printer = new PdfPrinter({
                  Roboto: {
                    normal: "Helvetica",
                    bold: "Helvetica-Bold",
                    italics: "Helvetica-Oblique",
                    bolditalics: "Helvetica-BoldOblique",
                  },
                });
            
                const dateOptions = { year: "numeric", month: "long", day: "numeric" };
            
                // Create document definition
                const docDefinition = {
                  content: [
                    { text: "Noizz", style: "header" },
                    { text: "\n" },
                    { text: "Order Information", style: "header1" },
                    { text: "\n" },
                    { text: "\n" },
                  ],
                  styles: {
                    header: {
                      fontSize: 25,
                      alignment: "center",
                    },
                    header1: {
                      fontSize: 12,
                      alignment: "center",
                    },
                    total: {
                      fontSize: 18,
                      alignment: "center",
                    },
                  },
                };
            
                // Create the table data
                const tableBody = [
                  ["Index", "Date", "User", "address" ,"Status", "PayMode",  "Amount"], // Table header
                ];   
                let totalAmount=0
                for (let i = 0; i < allOrder.length; i++) {
                  const data = allOrder[i];
                  totalAmount=totalAmount+data.totalAmount
                  const formattedDate = new Intl.DateTimeFormat(
                    "en-US",
                    dateOptions
                  ).format(new Date(data.date));
                  tableBody.push([
                    (i + 1).toString(), // Index value
                    formattedDate,
                    data.deliveryDetails.firstname,
                    data.deliveryDetails.address1,
                    data.status,
                    data.paymentMethod,
                    data.totalAmount,
                  ]);
                }
                const table = {
                  table: {
                    widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                    headerRows: 1,
                    body: tableBody,
                  },
                };
            
                // Add the table to the document definition
                docDefinition.content.push(table);
                docDefinition.content.push([
                  { text: "\n" },
                  { text: `Total:${totalAmount}`, style: "total" },
                ]);
                // Generate PDF from the document definition
                const pdfDoc = printer.createPdfKitDocument(docDefinition);
            
                // Pipe the PDF document to a write stream
                pdfDoc.pipe(writeStream);
            
                // Finalize the PDF and end the stream
                pdfDoc.end();
            
                writeStream.on("finish", () => {
                  res.download("order.pdf", "order.pdf");
                });
            } catch (error) {
              console.log(error)
            }
            }

module.exports={
    totalSaleExcel,
    totalRevenueExcel,
    productListExcel,
    allOrderStatus,
    orderDetailPDF,
    customPDF

}