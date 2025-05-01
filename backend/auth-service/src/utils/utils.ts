export async function cleanEmptyData(obj: any) {
    for (const cle in obj) {
      if (obj[cle] === "") {
        delete obj[cle];
      }
    }
  }
  