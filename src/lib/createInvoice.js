const fs = require("fs");
const PDFDocument = require("pdfkit");
const fullpath = "src/public/pdf/";
const Producto = require('../model/producto');

const createInvoice = async (invoice, user, path) => {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  await generateHeader(doc);
  await generateCustomerInformation(doc, invoice, user);
  await generateInvoiceTable(doc, invoice);
  await generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(fullpath + path + '.pdf'));
}

const generateHeader = async (doc) => {
  await doc
    .image("src/public/img/carrito.jpg", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Stocker SA.", 110, 57)
    .fontSize(10)
    .text("Stocker SA.", 200, 50, { align: "right" })
    .text("123 Calle Falsa", 200, 65, { align: "right" })
    .text("CABA, BA, 1604", 200, 80, { align: "right" })
    .moveDown();
}

const generateCustomerInformation = async (doc, invoice, user) => {
  await doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Datos Comprador", 50, 160);

    await generateHr(doc, 185);

  const customerInformationTop = 200;

  await doc
    .fontSize(10)
    .text("Nombre:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(user.nombre, 150, customerInformationTop)
    .font("Helvetica")
    .text("Fecha de compra:", 50, customerInformationTop + 15)
    .text(await formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Valor:", 50, customerInformationTop + 30)
    .text(
      invoice.total_venta,
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(user.apellido, 300, customerInformationTop)
    .font("Helvetica")
    .text(user.email, 300, customerInformationTop + 15)
    .text(
      invoice.direccion,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  await generateHr(doc, 252);
}

const generateInvoiceTable = async (doc, invoice) => {
  let i;
  const invoiceTableTop = 330;

  await doc.font("Helvetica-Bold");
  await generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Descripcion",
    "Costo unidad",
    "Cantidad",
    "Costo Total"
  );
  await generateHr(doc, invoiceTableTop + 20);
  await doc.font("Helvetica");

  for (i = 0; i < invoice.detalle.length; i++) {
    const item = invoice.detalle[i];
    const producto = await Producto.findById(item.id_producto);
        // console.log(producto)
    const position = invoiceTableTop + (i + 1) * 30;
    await generateTableRow(
      doc,
      position,
      producto.nombre,
      producto.descripcion,
      item.precio,
      item.cantidad,
      item.precio * item.cantidad
    );

    await generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  await generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "TOTAL",
    "",
    invoice.total_venta
  );
  await doc.font("Helvetica");
}

const generateFooter = async (doc) => {
  await doc
    .fontSize(10)
    .text(
      "Todos los pagos tienen una valides de 15 dias habiles.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

const generateTableRow = async (
  doc,
  y,
  item,
  descripcion,
  constoUnidad,
  cantidad,
  costoTotal
) => {
  await doc
    .fontSize(10)
    .text(item, 50, y)
    .text(descripcion, 150, y)
    .text(constoUnidad, 280, y, { width: 90, align: "right" })
    .text(cantidad, 370, y, { width: 90, align: "right" })
    .text(costoTotal, 0, y, { align: "right" });
}

const generateHr = async (doc, y) => {
  await doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

const formatDate = async (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return await (year + "/" + month + "/" + day);
}

module.exports = {
  createInvoice
};