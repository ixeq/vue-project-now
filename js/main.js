let eventBus = new Vue()

Vue.component('product', {
    template: `
    <div class="product">

    <div class="product-image">
        <img :src="image" :alt="altText" />
    </div>

    <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <a :href="link">More products like this.</a>

        <p v-if="inStock">In stock</p>
        
        <p v-else :class="{outOfStock: !inStock}"> Out of stock </p>

        <span v-show="onSale">{{ sale }}</span>



        <div
        class="color-box"
        v-for="(variant, index) in variants"
        :key="variant.variantId"
        :style="{ backgroundColor:variant.variantColor }"
        @mouseover="updateProduct(index)"
        ></div>


        <ul v-for="size in sizes">
            <li>{{size}}</li>
        </ul>


        <button
            v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
        >
            Add to cart
        </button>
        <button v-on:click="removeCart">Remove cart</button>
        <product-tabs :premium="premium" :reviews="reviews"></product-tabs>

    </div>

</div>
  `,
    data() {
        
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks.",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
         },         
        removeCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },     
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },          
     },
     
    mounted() {
    eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
    })
     },

     computed: {
        title() {
            return this.brand + ' ' + this.product;
        },     
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            return this.product + ' ' + this.brand + ' ' + "Распродажа!";
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },    
    },
     props: {
        premium: {
            type: Boolean,
            required: true
        },
    },
 
 })

Vue.component('product-details', {
    template: `
<div class="product">
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
</div>
 `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    },
})
 
Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">
        
    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
 
    <ul>
        <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>
<div id="v-model-radiobutton" class="demo">
    <p>Would you recommend this product?</p>
        <input type="radio" id="Yes" value="Yes" name="radio" v-model="radio" />
        <label for="Yes">Yes</label>
    <br>
        <input type="radio" id="No" value="No" name="radio" v-model="radio" />
        <label for="No">No</label>
</div>
   
    <p>
        <label for="name">Name:</label>
        <input required id="name" v-model="name" placeholder="name">
    </p>
    <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>
    <p>

        <label for="rating">Rating:</label>
    <div class="rating" >
        <input type="radio" id="star-5" name="rating" value="5" v-model.number="rating">
        <label for="star-5" ></label>	
        <input type="radio" id="star-4" name="rating" value="4" v-model.number="rating">
        <label for="star-4" ></label>    
        <input type="radio" id="star-3" name="rating" value="3" v-model.number="rating">
        <label for="star-3" ></label>  
        <input type="radio" id="star-2" name="rating" value="2" v-model.number="rating">
        <label for="star-2" ></label>    
        <input type="radio" id="star-1" name="rating" value="1" v-model.number="rating">
        <label for="star-1" ></label>
    </div>
        
        </select>
    </p>
    <p>
        <input type="submit" value="Submit"> 
    </p>
 
</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            radio: '',
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.radio) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    radio: this.radio,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.radio = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.radio) this.errors.push("Radio required.")
            }
        },
    },
})

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
          <h2>Reviews</h2>
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
              <p>Name: {{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>Review: {{ review.review }}</p>
              <p>Radio: {{ review.radio }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
            <product-details/>
        </div>
     </div>
     
`,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
    props: {

        reviews: {
            type: Array,
            required: false,
        },

        premium: {
            type: Boolean,
            required: true
        }
    },
    computed: {

        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart() {
            this.cart.pop();
        },
    },
})
 