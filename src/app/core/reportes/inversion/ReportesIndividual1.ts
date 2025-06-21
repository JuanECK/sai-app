//----------------------------------------//
//     Reporte Individual de Inversion    //
//----------------------------------------//

import { formatCurrency } from "@angular/common";
import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Injectable({
    providedIn: 'root'
})

export class ReportesIndividual1 {

    array: any;
    iframe: any;
    constructor() { }

    private formatoFechaLatina(fecha: string) {
        let d, m, a, res
        d = fecha.slice(8, 10)
        m = fecha.slice(5, 7)
        a = fecha.slice(0, 4)
        res = d + '/' + m + '/' + a
        return res
    }

    genera(arr: any, ifr:any) {

        this.array = arr
        this.iframe = ifr

        let pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: 'letter',
            // format: [4, 2]
        })
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const logoWidth = 20;
        const itemsPerPage = 20;
        const date = new Date().toLocaleDateString("es-CL", { year: 'numeric', month: "long", day: "2-digit" })

        let currentY = 4;

        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.text('Balance del periodo', 15, 2.6);
        pdf.text('Resumen de movimientos', 1.2, 7.5);


        //-----------------Tabla Individual------------------------------
        autoTable(pdf, {
            margin: { // Mover la tabla Horizontal
                left: 1.2,
            },
            styles: { overflow: 'linebreak' },
            body: [['Elaboracion:', date],
            ['Periodo:', `${this.formatoFechaLatina(this.array[0][0].Fecha_inicial)} a ${this.formatoFechaLatina(this.array[0][0].Fecha_final)}`],
            ['Solicitante:', this.array[0][0].Solicitante],
            ['Tipo:', 'Individual'],
            ['Cliente:', this.array[0][0].Inversionista],
            ['Modelo:', this.array[0][0].Modelo_Negocio],
            ],
            tableWidth: 8, // Tamaño de la Tabla

            columnStyles: {

                0: {// Column 1
                    fillColor: [255, 255, 255],
                    lineColor: [0, 0, 0],
                    halign: 'right',
                    fontStyle: 'bold',
                    cellWidth: 2.5,
                    minCellHeight: 0.2, // tamaño de las celdas
                    fontSize: 9,
                    lineWidth: {
                        right: 0,
                        bottom: 0.01,
                        top: 0.01,
                        left: 0.01,
                    },
                },
                1: {  // Column 2
                    fillColor: [255, 255, 255],
                    lineColor: [0, 0, 0],
                    fontSize: 9,
                    lineWidth: {
                        right: 0.01,
                        bottom: 0.01,
                        top: 0.01,
                        left: 0,
                    },
                },
            },

            didParseCell: function (data) {

                if (data.row.cells[0].raw == 'Tipo:') {
                    data.cell.styles.fontSize = 18;
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.row.cells[0].raw == 'Cliente:') {
                    data.cell.styles.fillColor = '#D9D9D9';

                }
                // data.row.height = 1; // tamaño de las celdas
            }
        });


        // -------------------------Balance del periodo---------------------
        autoTable(pdf, {
            // // body:bodyRows(3),
            // body: this.array[2].map(item => [item.Concepto, item.Fecha, item.Monto]),
            startY: 3,
            margin: {
                left: 10,
            },
            body: [['Retiro de capital:', `${formatCurrency(this.array[1][0].Retiro_Capital, 'en', '$ ', '', '1.2-4')} MXN`],
            // [ 'Retiro de rendimientos:',`${ formatCurrency( 2000000000000000000000, 'en', '$ ', '', '1.2-4') } MXN` ],
            ['Retiro de rendimientos:', `${formatCurrency(this.array[1][0].Retiro_Rendimientos, 'en', '$ ', '', '1.2-4')} MXN`],
            ['Aporte a capital:', `${formatCurrency(this.array[1][0].Aporte_Capital, 'en', '$ ', '', '1.2-4')} MXN`],
            ['Saldo a la fecha:', `${formatCurrency(2000, 'en', '$ ', '', '1.2-4')} MXN`],
                // [ 'Saldo a la fecha:',`${ formatCurrency( this.array[1][0].Egresos, 'en', '$ ', '', '1.2-4') } MXN` ],
            ],

            tableWidth: 10.4, // Tamaño de la Tabla

            columnStyles: {

                0: {// Column 1
                    fillColor: [255, 255, 255],
                    lineColor: [0, 0, 0],
                    halign: 'left',
                    fontStyle: 'bold',
                    cellWidth: 4,
                    minCellHeight: 0.2, // tamaño de las celdas
                    fontSize: 9,
                    //cellPadding: 3,//Padding de los textos
                    lineWidth: {
                        right: 0,
                        bottom: 0.01,
                        top: 0.01,
                        left: 0.01,
                    },
                },
                1: {  // Column 2
                    fillColor: [255, 255, 255],
                    lineColor: [0, 0, 0],
                    halign: 'right',
                    fontSize: 9,
                    lineWidth: {
                        right: 0.01,
                        bottom: 0.01,
                        top: 0.01,
                        left: 0,
                    },
                },
            },

            didParseCell: function (data) {

                if (data.row.cells[0].raw == 'Saldo a la fecha:' && data.column.index === 1) {
                    data.cell.styles.fontSize = 14;
                    data.cell.styles.fontStyle = 'bold';
                    // data.cell.styles.fillColor = '#D9D9D9';
                    // console.log(data.cell.styles.cellPadding)
                }


                // if (data.row.index === 0 && data.column.index === 0) {
                //   const cellHeight = data.cell.height;
                // }

                if (data.row.cells[0].raw == 'Saldo a la fecha:' && data.column.index === 0) {
                    data.cell.styles.cellPadding = { top: 0.29, right: 0, bottom: 0, left: 0.1763888888888889 };

                    let height = data.row.cells[1].text
                    console.log(height[0].length)

                    if ((height![0].length > 24)) {
                        data.cell.styles.cellPadding = { top: 0.26, left: 0.1763888888888889 };
                        console.log('esta')
                    }

                    if ((height![0].length > 29)) {
                        data.cell.styles.cellPadding = { top: 0.24, left: 0.1763888888888889 };
                    }
                    if ((height![0].length > 34)) {
                        data.cell.styles.cellPadding = { top: 0.19, left: 0.1763888888888889 };
                    }
                }

                if (data.row.cells[0].raw == 'Saldo a la fecha:' && data.column.index === 1) {
                    let height = data.row.cells[1].text
                    // console.log(height[0].length)
                    if ((height[0].length > 24)) {
                        data.cell.styles.fontSize = 12;
                    }

                    if ((height[0].length > 29)) {
                        data.cell.styles.fontSize = 10;
                    }
                    if ((height[0].length > 34)) {
                        data.cell.styles.fontSize = 9;
                    }
                }


                // if (data.section === 'body' && data.column.index === 0) {
                //         // Ajustar el espaciado horizontal
                //         data.cell.text = data.cell.text[0].split('').join(' ');
                //     }
                // data.cell.text[0] = data.cell.text[0].split('').join(' '); // agregar espacio entre letras
                // data.row.height = 1; // tamaño de las celdas
            },

            // didDrawPage : (data) => {
            //     console.log(data.settings.margin)
            //     data.settings.margin.top = 5;
            // }

        });


        function bodyRows(rowCount: any) {
            rowCount = rowCount || 10
            var body = []
            for (var j = 1; j <= rowCount; j++) {
                body.push([
                    'Retiro parcial de inversión',
                    '2025-05-14',
                    '91000',
                    // city: 'maria',
                    // expenses: 'beto',
                ])
            }
            return body
        }

        autoTable(pdf, {
            // // body:bodyRows(3),

            startY: 7.7,
            margin: { // Mover la tabla Horizontal
                left: 1.2,
            },
            styles: { overflow: 'linebreak' },
            head: [['Concepto', 'Fecha', 'Monto']],
            // body: bodyRows(20),
            body: this.array[2].map((item:any) => [item.Concepto, item.Fecha, item.Monto]),
            tableWidth: 19.2, // Tamaño de la Tabla

            didParseCell: function (data) {
                if (data.row.index % 2 === 0) { // Fila par
                    // data.cell.styles.fillColor = [240, 40, 240]; // Gris claro
                    data.cell.styles.fillColor = [255, 255, 255]; // Blanco
                } else { // Fila impar
                    data.cell.styles.fillColor = [220, 220, 220]; // Gris claro
                }
                // if (data.column.index === 0) { //Primera columna
                if (data.row.index === 0) {
                    data.cell.styles.fillColor = [255, 255, 255]; // Gris claro
                    data.cell.styles.textColor = [0, 0, 0]
                }
                //    data.cell.styles.textColor = [0, 0, 255]; // Azul
                // }
            }
        });

        const addPageNumbers = () => {
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {

                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text(`Pagina ${i} de ${pageCount}`, pageWidth - 3.5, pageHeight - 1);
            }

        };

        // addTableHeader();
        addPageNumbers()


        pdf.setProperties({
            title: `Individual - ${this.array[0][0].Modelo_Negocio}`
        })

        this.iframe.nativeElement.src = pdf.output('bloburl');
        // this.iframe.nativeElement.src = pdf.output('datauristring');

    }

}