import ProductFilter from "@/components/product/ProductFilter";
async function getProducts(searchParams) 
{
    const searchQuery = new URLSearchParams({
    page: searchParams.page || 1,
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    ratings: searchParams.ratings || "",
    category: searchParams.category || "",
    tag: searchParams.tag || "",
    brand: searchParams.brand || "",
    }).toString();
    //
   }
   export default async function Shop({ searchParams }) {
    console.log("searchParams in shop page => ", searchParams);
    const data = await getProducts(searchParams);
    return (
    <div className="container-fluid">
    <div className="row">
    <div className="col-lg-3 overflow-auto" style={{ maxHeight: "90vh"
   }}>
    <ProductFilter searchParams={searchParams} />
    </div>
    <div className="col-lg-9">Products list</div>
    </div>
    </div>
    );
}