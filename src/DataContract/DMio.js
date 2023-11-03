const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  
  wallet: {
    mnemonic: 'Put 12 word mnemonic here..', // <- CHECK
    
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 910000, //<- CHANGE*********
      
    },
  },
};

const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const { platform } = client;
  const identity = await platform.identities.get(
    'Put the identity id for the mnemonic here..'  // <- CHECK
  );


   /* 1) PERFORM 5 QUERIES FOR MOST RECENT ON PAGELOAD
  { //'categorycreatedAt'
    where: [
      ['category', '==', 'offrent'], // offrent, offbiz, offother, lookrent, lookother
      ['createdAt', '<=' , Date.now()] 
    ],
    orderBy: [
    ['createdAt', 'desc'],
  ],
  }*/

  /* 2) NEED TO DO 5 QUERIES FOR EACH SEARCH (need to normalize/lowercase)
  { //'countrycategorycreatedAt'
    where: [
      ['country', 'startsWith', ****Country***],
      ['category', '==', 'offrent'], // offrent, offbiz, offother, lookrent, lookother
      ['createdAt', '<=' , Date.now()] 
    ],
    orderBy: [
    ['createdAt', 'desc'],
  ],
  }*/

  /* 3) NEED TO DO 5 QUERIES FOR EACH SEARCH (need to normalize/lowercase)
  { 
    where: [
      ['city', 'startsWith', ****City***],
      ['category', '==', 'offrent'],
      ['createdAt', '<=' , Date.now()]
    ],
    orderBy: [
    ['createdAt', 'desc'],
  ],
  }*/

  //###################################################################
  
  const contractDocuments = {
    dmiopost:{
      type: 'object',
      indices: [
        { 
          name: 'categorycreatedAt',
          properties: [{category: 'asc'},{ $createdAt: 'asc' }],
          unique: false,
        },
        {
          name: 'countrycategorycreatedAt',
          properties: [{ country: 'asc' },{category: 'asc'},{ $createdAt: 'asc' }],
          unique: false,
        }, 
        {
          name: 'regioncategorycreatedAt', //reg is region for state or province, etc
          properties: [{ region: 'asc' },{category: 'asc'},{ $createdAt: 'asc' }],
          unique: false,
        },
        {
          name: 'citycategorycreatedAt', 
          properties: [{ city: 'asc' },{category: 'asc'},{ $createdAt: 'asc' }],
          unique: false,
        },
        {
          name: 'cityregioncategorycreatedAt', 
          properties: [{ city: 'asc' },{ region: 'asc' },{category: 'asc'},{ $createdAt: 'asc' }],
          unique: false,
        },{
          name: 'citycountrycategorycreatedAt', 
          properties: [{ city: 'asc' },{ country: 'asc' },{category: 'asc'},{ $createdAt: 'asc' }],
          unique: false,
        },
        {
          name: 'ownerIdAndcreatedAt',
          properties: [{ $ownerId: 'asc' }, { $createdAt: 'asc' }],
          unique: false,
        },
        
      ],

      properties: {
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },
        region: {
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },
        country: {
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },
        
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 350,
        },

        category: { 
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },

        link:{ 
          type: 'string',
          minLength: 1,
          maxLength: 250,
    },
        active:{
          type: 'boolean'
        },
        dgp:{
          type:'boolean'
        } 
      },
      required: ['city', 'region', 'country', 'description', 'category', 'active', "$createdAt", "$updatedAt"],
      additionalProperties: false,
    },

  };


  const contract = await platform.contracts.create(contractDocuments, identity);
  console.dir({ contract: contract.toJSON() });

  await platform.contracts.publish(contract, identity);
  return contract;
  
};

registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
