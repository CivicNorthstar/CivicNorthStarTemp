const apiKey = 'eo_2bfb0c6db5c9e1db48835381acae355a0c31edd9742b12c327849d020baa97c1';
const listId = 'ed364f62-1bd5-11f1-a557-ed50c1110101';
const fields = ['Role', 'Municipality', 'TeamSize', 'Referral'];

async function createFields() {
  const results = await Promise.all(fields.map(async (field) => {
    const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        tag: field,
        type: 'TEXT',
        label: field
      })
    });
    const data = await response.json();
    return { field, status: response.status, data };
  }));
  console.log(JSON.stringify(results, null, 2));
}

createFields();
