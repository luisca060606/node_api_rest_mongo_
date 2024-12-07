// middleware manage objects

const getObject = obj => {
	return async(req, res, next) => {
		let object;
		const { id } = req.params;

		if (!id.match(/^[0-9a-fA-F]{24}$/)){
			return res.status(404).json(
				{
					message: `ID ${obj.modelName} not found`
				}
			)
		}
		try {
			object = await obj.findById(id)
			if(!object) {
				return res.status(404).json({message: `${obj.modelName} not found`})
			}
		} catch (error) {
			return res.status(500).json({message: error.message})
		}
		res.object = object;
		next()
	}
}

module.exports = getObject;