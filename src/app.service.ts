import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from './currencies.dto';
import { Currency } from './currency.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Currency) private readonly currencyRepository: Repository<Currency>,
  ) {}

  async createPair(createCurrencyDto: CreateCurrencyDto) {
    let newPair;
    let pair = await this.currencyRepository.findOne({
      where: [{from:createCurrencyDto.from,to:createCurrencyDto.to}, {from:createCurrencyDto.to, to:createCurrencyDto.from}]
    })
    
    if (!pair) {
       newPair = await this.currencyRepository.create(createCurrencyDto);
      await  this.currencyRepository.save(newPair);
    }
    else {
      pair.from = createCurrencyDto.from
      pair.to = createCurrencyDto.to
      pair.rate = createCurrencyDto.rate
      
     await  this.currencyRepository.save(pair);

    }

     
         return this.currencyRepository.find({});


  }
      

  async getShortestPath(start,end, amount) {
    let gg = await this.currencyRepository.createQueryBuilder('currency')
    .distinct(true)
    .select(['currency.from', 'currency.to', 'currency.rate'])
    .getRawMany();

   let graph = gg.reduce(function (r, a) {
       r[a.currency_from] = r[a.currency_from] || [];
       r[a.currency_to] = r[a.currency_to] || [];
       r[a.currency_from].push({to:a.currency_to,rate:a.currency_rate});
       r[a.currency_to].push({to:a.currency_from,rate:1/a.currency_rate});
       return r;
   }, Object.create(null));

 
   
    function bfs(graph, start, end ) {
        let queue = [[(start), []]],
            seen = new Set;
        let path ;
        while (queue.length) {          
            let [curVert, [...path],rate] = queue.shift();

            rate = rate ? rate : 1
            path.push({curVert,rate});
                      
            if (curVert === end) return path;
            if (!seen.has(curVert) && graph[curVert]) {
              
              
                queue.push(...graph[curVert].map(v => {               
                  return [v.to, path,v.rate]
                }));


                
            }            
            seen.add(curVert);
        }        
    }
    
    let startt = start
    let endd = end
    if (bfs(graph, startt, endd)) {

      let path = bfs(graph, startt, endd)


      let total = amount
      path.forEach(elm => {        
        total =  elm.rate / total
      });
      console.log(path);
      

      
      return total
    }
    else{
      return "no data"
    }
     

    
}
}
