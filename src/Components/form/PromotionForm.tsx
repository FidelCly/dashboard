import React, { useCallback, useState } from 'react'
import type {IPromotionCreatePayload, IPromotions} from '@/Api/Models/Promotions'
import { PromotionService, ShopService } from '@/Api/Services'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IShop } from '@/Api/Models/Shop'


// react fc with a promotion variable
const PromotionForm: React.FC<{promotion?: IPromotions}> = ({promotion}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPromotionCreatePayload>()

  const onSubmit: SubmitHandler<IPromotionCreatePayload> = useCallback(async (data) => {
    if (promotion?.id) {
      // update promotion
      try {
        //convert checkoutLimit and shopId to number
        data.checkoutLimit = Number(data.checkoutLimit)
        data.shopId = Number(data.shopId)
        const response = await PromotionService.updatePromotion(promotion.id as string, data)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }else{
      try {
      //convert checkoutLimit and shopId to number
      data.checkoutLimit = Number(data.checkoutLimit)
      data.shopId = Number(data.shopId)
      const response = await PromotionService.createPromotion(data)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    }
  }, [])

  const [shops, setShops] = useState<IShop[]>([])

  // get all shops
  const getShops = () => {
    ShopService.getShops()
      .then((response: any) => {
        setShops(response.data)
        console.log(response.data)
      })
      .catch((e: Error) => {
        console.log(e)
      })
  }

  React.useEffect(() => {
    getShops()
  }, [])
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            {...register('name', { required: true })}
            type="text"
            className="form-control"
            id="name"
            maxLength={50}
            value={promotion?.name}
          />
          {errors.name && <span>This field is required</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            {...register('description', { required: true })}
            type="text"
            className="form-control"
            id="description"
            maxLength={250}
            value={promotion?.description}
          />
          {errors.description && <span>This field is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="shopId">Shop</label>
          <select
            {...register('shopId', { required: true })}
            className="form-control"
            id="shopId"
            value={promotion?.shopId}
          >
            <option value="">Select a shop</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.companyName}
              </option>
            ))}
          </select>
          {errors.shopId && <span>This field is required</span>}
        </div>
        

        <div className="form-group">
          <label htmlFor="startAt">Start At</label>
          <input
            {...register('startAt', { required: true })}
            type="date"
            className="form-control"
            id="startAt"
            value={promotion?.startAt}
          />
          {errors.startAt && <span>This field is required</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="endAt">End At</label>
          <input
            {...register('endAt', { required: true })}
            type="date"
            className="form-control"
            id="endAt"
            value={promotion?.endAt}
          />
          {errors.endAt && <span>This field is required</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="checkoutLimit">Checkout Limit</label>
          <input
            {...register('checkoutLimit', { required: true })}
            type="number"
            className="form-control"
            id="checkoutLimit"
            value={promotion?.checkoutLimit}
          />
          {errors.checkoutLimit && <span>This field is required</span>}
        </div>
        
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </div>
    </div>
    </form>
  )
}

export default PromotionForm
