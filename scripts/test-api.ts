/**
 * Test script to verify the JKKN API endpoint
 */

const apiKey = process.env.JKKN_API_KEY || 'jk_8fc4cb776134304404c0cec5cca58d19_mhuanome'
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.jkkn.ai'
const endpoint = '/api/api-management/organizations/institutions'
const url = `${baseUrl}${endpoint}`

console.log('Testing JKKN API...')
console.log('Environment Variables:')
console.log('- JKKN_API_KEY:', process.env.JKKN_API_KEY ? '✓ Found' : '✗ Not found')
console.log('- NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'Using default')
console.log('\nAPI Details:')
console.log('- URL:', url)
console.log('- API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'MISSING')

async function testApi() {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    console.log('\nResponse Status:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('✓ Success!')
      console.log('Total institutions:', data.data?.length || 0)
      console.log('\nFirst 3 institutions:')
      data.data?.slice(0, 3).forEach((inst: any, i: number) => {
        console.log(`  ${i + 1}. ${inst.name} (${inst.counselling_code})`)
      })
    } else {
      console.error('✗ Failed!')
      const errorText = await response.text()
      console.error('Error:', errorText.substring(0, 200))
    }
  } catch (error) {
    console.error('✗ Error:', error)
  }
}

testApi()
