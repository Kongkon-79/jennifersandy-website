'use client'
import MapComponent from '@/components/apartments/MapComponent'
export default function GoogleMapInner(){return <div className="h-64 w-full md:h-80"><MapComponent apartments={[{id:'office',title:'0211wohnen · VENTOS Immobilien GmbH',price:0,priceType:'unknown',pricePeriod:null,lat:51.216,lng:6.765,hasMapLocation:true}]} center={[51.216,6.765]} zoom={15}/></div>}
