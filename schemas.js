const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => {
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML!!'
        },
        rules: {
            escapeHTML: {
                validate(value,helpers){
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if(clean !== value) return helpers.error('string.escapeHTML');
    
                    return clean;
                }
            }

        }
    }
}

const Joi = BaseJoi.extend(extension);

module.exports.productSchema = Joi.object({
    image: Joi.string().trim().required(),
    category: Joi.any().valid('gadget','fashion','accessory').required(),
    name: Joi.string().trim().required().escapeHTML(),
    desc: Joi.string().trim().required().escapeHTML(),
    newPrice: Joi.number().min(0).required(),
    oldPrice: Joi.number().min(0).required(),
    avgRating: Joi.number().default(0),
    totalReviews: Joi.number().default(0)
});

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().min(1).required(),
    comment: Joi.string().allow('').trim().escapeHTML()
});