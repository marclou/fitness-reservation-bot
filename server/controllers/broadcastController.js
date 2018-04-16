module.exports = {
    index: (req, res, next) => {
    	res.render('broadcast', { tabTitle: 'Broadcast' });
    },
};
