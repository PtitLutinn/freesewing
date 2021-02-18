function findR( height, arcLength ) {
  let iter = 0;
  let a = 0.5;
  let diff = a*height/(1-Math.cos(a/2))-arcLength
  
  do{
    if( diff < 0 ) {
      a = a *(.995+diff/1000);
    } else {
      a = a *(1.002+diff/1000);
    }
    diff = a*height/(1-Math.cos(a/2))-arcLength
    iter ++;
    console.log( {iter, diff, a} );
  } while( (diff < -0.1 || diff > 0.1) && iter < 1000 )
  return( a * (180 / Math.PI) );
}


export default function (part) {
  let {
    options,
    measurements,
    Point,
    Path,
    points,
    paths,
    Snippet,
    snippets,
    complete,
    sa,
    store,
    paperless,
    macro
  } = part.shorthand()

  const cc = 0.551915024494; // circle constant

  let halfInch = store.get( 'halfInch' );
  let cuffWidth = halfInch * 4 * (1+options.cuffWidth)
  let flapLength = halfInch *3
  let traditional = (options.cuffStyle == 'traditional');

  let belowKnee = measurements.knee *(traditional ? options.kneeToBelow : 1)
  let flapRatio = (flapLength) / (belowKnee/2)

  console.log( 'knee: ' +measurements.knee )
  console.log( 'belowKnee: ' +belowKnee )
  
  let angle = findR( halfInch /4 *5, belowKnee /2)
  let angleR = angle /(180 / Math.PI)
  let radius = ( belowKnee /2) / angleR
  console.log('angle: ' +angle );
  console.log('radius: ' +radius );

  points.pA = new Point( 0, 0 );
  points.pB = points.pA.shift( 270, belowKnee /2 );
  points.pE = points.pB.shift( 0, cuffWidth );
  points.pF = points.pA.shift( 0, cuffWidth );

  if( traditional ) {
    points.pC = points.pB.shift( 270 -angle/2, 2 * radius * Math.sin(angleR/2) );
    points.pBcpC = points.pB.shift( 270, radius *cc /2);
    points.pCcpB = points.pC.shift( 90 -angle, radius *cc /2);
    points.pD = points.pC.shift( 0 -angle, cuffWidth )
    points.pDcpE = points.pD.shift( 90 -angle, (radius +cuffWidth) *cc /2);
    points.pEcpD = points.pE.shift( 270, (radius +cuffWidth) *cc /2);
    points.pAout = points.pA.shift( 90 +(angle/2) *flapRatio, (2 * radius * Math.sin(angleR/2)) *flapRatio );
    points.pAcpAout = points.pA.shift( 90, radius *flapRatio *cc /2);
    points.pAoutcpA = points.pAout.shift( 270 +(angle *flapRatio), (radius *cc /2) *flapRatio );
    points.pFout = points.pAout.shift( 0 +angle *flapRatio, cuffWidth )
    points.pFoutcpF = points.pFout.shift( 270 +(angle *flapRatio), (radius +cuffWidth) *cc /2 *flapRatio);
    points.pFcpFout = points.pF.shift( 90, (radius +cuffWidth) *cc /2 *flapRatio);
  } else {
    points.pC = points.pB.shift( 270, belowKnee /2 );
    points.pBcpC = points.pB.shift( 270, 10 );
    points.pCcpB = points.pC.shift( 90, 10 );
    points.pD = points.pC.shift( 0, cuffWidth )
    points.pDcpE = points.pD.shift( 90, 10 );
    points.pEcpD = points.pE.shift( 270, 10 );
    points.pAout = points.pA.shift( 90, belowKnee /2 *flapRatio );
    points.pAcpAout = points.pA.shift( 90, 1);
    points.pAoutcpA = points.pAout.shift( 270, 1 );
    points.pFout = points.pAout.shift( 0, cuffWidth )
    points.pFoutcpF = points.pFout.shift( 270, 1);
    points.pFcpFout = points.pF.shift( 90, 1);
  }
  points.pG = points.pAout.shift( points.pAout.angle( points.pFout ) +45, Math.sqrt( 2* (cuffWidth/2) *(cuffWidth/2)))

  paths.seam = new Path()
    .move( points.pA )
    .line( points.pB )
    .curve( points.pBcpC, points.pCcpB, points.pC )
    .line( points.pD )
    .curve( points.pDcpE, points.pEcpD, points.pE )
    .line( points.pF )
    .curve( points.pFcpFout, points.pFoutcpF, points.pFout )
    .line( points.pG )
    .line( points.pAout )
    .curve( points.pAoutcpA, points.pAcpAout, points.pA )
    .close()
    .attr('class', 'fabric');
  
  paths.mark = new Path()
    .move( points.pA )
    .line( points.pF )
    .attr('class', 'fabric');

  if( complete ) {
    points.buttonHole = points.pAout.shiftFractionTowards( points.pFout, .50 );
    points.button = points.pC
      .shiftFractionTowards( points.pD, .50 )
      .shift( points.pC.angle( points.pD ) +90, belowKnee /2 *flapRatio )

    snippets.bh = new Snippet( 'buttonhole', points.buttonHole );
    snippets.b = new Snippet( 'button', points.button );

    snippets.n1 = new Snippet( 'notch', points.pA );
    snippets.n2 = new Snippet( 'notch', points.pB );
    snippets.n3 = new Snippet( 'notch', points.pC );
  
    points.logo = points.pA.shiftFractionTowards( points.pE, .50 ) //.shift(180,70).shift(270,30);
    console.log( points.logo );
    snippets.logo = new Snippet( 'logo', points.logo );
    points.title = points.logo.shift(270, 70)
    macro('title', {
      nr: 78,
      at: points.title,
      title: 'LegBand'
    })
    points.__titleNr.attr('data-text-class', 'center')
    points.__titleName.attr('data-text-class', 'center')
    points.__titlePattern.attr('data-text-class', 'center')
    
    if( sa ) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')
    }
  }

  // Paperless?
  if (paperless) {
    macro('hd', {
      from: points.pA,
      to: points.pF,
      y: points.pA.y
    })
    macro('hd', {
      from: points.pB,
      to: points.pC,
      y: points.pB.y
    })
    macro('ld', {
      from: points.pD,
      to: points.pC,
      d: +sa +15
    })
    macro('ld', {
      from: points.pA,
      to: points.pAout,
      d: +sa +15
    })
    macro('vd', {
      from: points.pB,
      to: points.pA,
      x: points.pA.x -sa -15
    })
    macro('vd', {
      from: points.pC,
      to: points.pB,
      x: points.pC.x
    })
  }

  return part;
}
