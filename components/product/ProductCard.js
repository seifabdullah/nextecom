import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)


export default function ({product}){
    return(
        <div className="card mb-4 col-lg-4 my-3" key={product?._id}>
           <div  style={{height: '200px', overflow: 'hidden'}}>
                <Image src={product?.images?.[0]?.secure_url ||"/images/default.jpeg" }
                    width={500}
                    height={300}
                    style={{objectFit:'cover', width:'100%', height: "100%"}}
                    alt={product?.title}
                />
           </div>
           
           <div className="card-body">
                <Link href={`/product/${product?.slug}`}> <h5 className="card-title">{product?.title}</h5></Link>
                <div dangerouslySetInnerHTML={{__html: product?.description.length > 160 ? 
                `${product?.description?.substring(0,160)}..`
                    :
                 product?.description }}/>
           </div>

           <div className="card-footer d-flex justify-content-between">
                <small><strong>Category :</strong>  {product?.category?.name}</small>
                <small><strong>Tag :</strong> {product?.tags?.map((t) => t?.name).join(" ")} </small>
           </div>

           <div className="card-footer d-flex justify-content-between">
                <small>Likes 🤍</small>
                <small>
                    Posted {dayjs(product?.createdAt).fromNow()}
                </small>
           </div>     

            <div className="card-footer d-flex justify-content-between">
                <small> <strong>Brand :</strong> {product?.brand}</small>
                <small>Stars 🌟</small>
           </div>      
        </div>
    )
}