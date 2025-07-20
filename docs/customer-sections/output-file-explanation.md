## Output file (for customer)

This section is important because it shows customers the concrete outcome they’ll get from the product - an Excel file generated as a result of its work

---
### Output File Description

The project generates the following output file:

```commandline
priorities_"semester""date".xlsx
```

The file consists of three Excel spreadsheets: 
- All Priorities
  - it considers all student's submitted priorities, works like a submit history   
![all pr](docs/all_pr.png)
- Last Priorities
  - it contains the last submitted student's priority  
![last_pr](docs/last_pr.png)
- Legend
  - it contains the full abbreviations, that have been created to make the navigation through the file easier    
![legend](docs/legend.png)

---
### Technical details
Code contains the algorithm for creating an Excel file, using the [npm](https://www.npmjs.com/)'s exceljs library

**Hook:** [useExcelExport.js](frontend/src/hooks/useExcelExport.js)   
**Tool:** [exceljs](https://www.npmjs.com/package/exceljs)  
**Algorithm:**
1. Generating Excel file buffer
```commandline
const buffer = await workbook.xlsx.writeBuffer();
```
   - _workbook.xlsx.writeBuffer()_ is an asynchronous method that converts an Excel workbook into a binary buffer (a sequence of bytes)
   - _await_ waiting for the completion of this operation
2. Creating a Blob object
```commandline
const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});
```
- _blob (Binary Large Object)_ is an object that represents binary data
- _[buffer]_ – buffer with data from the Excel file
- _type_ specifies the MIME type of the file (in this case - .xlsx).
3. Creating a download link
```commandline
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = `priorities_${semesterName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
```
- _document.createElement("a")_ creates HTML-link
- _URL.createObjectURL(blob)_ generates a temporary URL for the blob that can be used for downloading
- _link.download_ sets the filename when downloading
4. Adding a link to the DOM and automatic downloading
```commandline
document.body.appendChild(link);
link.click();
```
- _document.body.appendChild(link)_ adds a link to the DOM
- _link.click()_ is a programmatic click on the link that initiates the download
5. Cleanup (removing the link and freeing memory)
```commandline
setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}, 100);
```
- _setTimeout_ delay before cleanup (100 ms)
- _document.body.removeChild(link)_ removes the link from the DOM
- _URL.revokeObjectURL(link.href)_ frees up the memory occupied by the temporary URL
---
### Notes
- All files use UTF-8 encoding
- Date formats follow ISO 8601 standard (YYYY-MM-DD)
- Empty (`null` in database) values are displayed as empty cells