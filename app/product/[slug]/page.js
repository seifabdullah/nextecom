import ProductImage from "@/components/product/ProductImage"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import ProductLike from "@/components/product/ProductLike"
import ProductRating from "@/components/product/ProductRating"


dayjs.extend(relativeTime)


async function  getProduct(slug) {
     const response = await fetch (`${process.env.API}/product/${slug}`,{
        method: "GET",
        next: {revalidate: 1}
     })   
    
if(!response){
    throw new Error("Failed to fetch product")
}
 const data = await response.json()
 return data
}



export default async function ProductViewPage({params}) {
    const product = await getProduct(params?.slug)
    return(
        <div className="container my-4">
            <div className="row">
                <div className="col-lg-8 offset-lg-2 card py-5">
                    <h1 className="text-center">{product?.title}</h1>

            {/* {Show Image} */}
            <ProductImage product={product}/>

            <div className="card-body">
                <div dangerouslySetInnerHTML=
                {{__html: product?.description.replace(/\./g,"<br/>") }}

                />
           </div>

           <div className="card-footer d-flex justify-content-between">
                <small><strong>Category :</strong>  {product?.category?.name}</small>
                <small><strong>Tag :</strong> {product?.tags?.map((t) => t?.name).join(" ")} </small>
           </div>

           <div className="card-footer d-flex justify-content-between">
                <ProductLike product={product}/>
                <small>
                    Posted {dayjs(product?.createdAt).fromNow()}
                </small>
           </div>     
    
            <div className="card-footer d-flex justify-content-between">
                <small> <strong>Brand :</strong> {product?.brand}</small>
                <div className="card-footer my-5">
                <small><ProductRating  product={product} /></small>
                </div>
           </div> 
            </div>
            </div>
            <div className="row">
                    <div className="col">
                            <h4 className="text-center my-5"> Related Products</h4>
                    </div>
            </div>
        </div>    
    )
}