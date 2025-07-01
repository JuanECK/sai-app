//----------------------------------------//
//     Reporte Global de Inversiones      //
//        Con Ingresos y Egresos          //
//----------------------------------------//

import { formatCurrency } from "@angular/common";
import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Injectable({
    providedIn: 'root'
})

export class ReportesGlobalInmobiliarioICPC1 {

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
        // pdf.text('Balance del periodo', 15, 2.7);
        pdf.text('Catálogo de Clientes', 1.2, 5.6);


        //-----------------Tabla Individual------------------------------
        autoTable(pdf, {
            margin: { // Mover la tabla Horizontal
                left: 1.2,
            },
            styles: { overflow: 'linebreak' },
            body: [['Elaboracion:', date],
            ['Periodo:', `${this.formatoFechaLatina(this.array[0][0].Fecha_inicial)} a ${this.formatoFechaLatina(this.array[0][0].Fecha_final)}`],
            ['Solicitante:', this.array[0][0].Solicitante],
            ['Tipo:', 'Global de Inversiones'],
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
                    data.cell.styles.fontSize = 13;
                    data.cell.styles.fontStyle = 'bold';
                }
                // if (data.row.cells[0].raw == 'Cliente:') {
                //     data.cell.styles.fillColor = '#D9D9D9';

                // }
                // data.row.height = 1; // tamaño de las celdas
            }
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

            startY: 5.8,
            margin: { // Mover la tabla Horizontal
                left: 1.2,
            },
            styles: { overflow: 'linebreak' },
            head: [['No', 'Propiedad']],
            // body: bodyRows(20),
            body: this.array[2].map((item:any, index:number) => [index + 1, item.Concepto]),
            tableWidth: 19.2, // Tamaño de la Tabla

            columnStyles: {

                0: {// Column 1
                    cellWidth: 0.8,
                    halign: 'center',
                },
            },

            didParseCell: function (data) {
                if (data.row.index % 2 === 0) { // Fila par
                    // data.cell.styles.fillColor = [240, 40, 240]; // Gris claro
                    data.cell.styles.fillColor = [255, 255, 255]; // Blanco
                    data.cell.styles.textColor = [0, 0, 0]
                } else { // Fila impar
                    data.cell.styles.fillColor = [220, 220, 220]; // Gris claro
                    data.cell.styles.textColor = [0, 0, 0]
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
            title: `Inversiones catalogo`
        })

        this.iframe.nativeElement.src = pdf.output('bloburl');
        // this.iframe.nativeElement.src = pdf.output('datauristring');

    }

}